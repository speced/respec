// @ts-check
/**
 * Module core/biblio-db
 *
 * Wraps IndexedDB, allowing the storage of references and aliases on the
 * client.
 *
 * It's a standalone module that can be imported into other modules.
 *
 * @typedef {object} BiblioEntry
 * @property {string} id
 * @property {string} title
 *
 * @typedef {object} BiblioAliasEntry
 * @property {string} id
 * @property {string} aliasOf
 */
import { flatten } from "./utils.js";
import { importIdb } from "./idb.js";
import { pub } from "./pubsubhub.js";
export const name = "core/biblio-db";

const ALLOWED_TYPES = new Set(["alias", "reference"]);
const hasIndexedDB = typeof indexedDB !== "undefined";
const dbMaps = {
  /** @type {Map<string, BiblioEntry>} */
  reference: new Map(),
  /** @type {Map<string, BiblioAliasEntry>} */
  alias: new Map(),
};

/* Database initialization tracker */
const readyPromise = openIdb();

async function openIdb() {
  if (!hasIndexedDB) {
    return;
  }
  const { openDB } = await importIdb();
  return await openDB("respec-biblio2", 12, {
    upgrade(db) {
      Array.from(db.objectStoreNames).map(storeName =>
        db.deleteObjectStore(storeName)
      );
      const store = db.createObjectStore("alias", { keyPath: "id" });
      store.createIndex("aliasOf", "aliasOf", { unique: false });
      db.createObjectStore("reference", { keyPath: "id" });
    },
  });
}

export const biblioDB = {
  get ready() {
    return readyPromise;
  },
  /**
   * Finds either a reference or an alias.
   * If it's an alias, it resolves it.
   *
   * @param {String} id The reference or alias to look for.
   * @return {Promise<Object?>} The reference or null.
   */
  async find(id) {
    if (await this.isAlias(id)) {
      id = await this.resolveAlias(id);
    }
    return await this.get("reference", id);
  },
  /**
   * Checks if the database has an id for a given type.
   *
   * @param {String} type One of the ALLOWED_TYPES.
   * @param {String} id The reference to find.
   * @return {Promise<Boolean>} True if it has it, false otherwise.
   */
  async has(type, id) {
    if (!ALLOWED_TYPES.has(type)) {
      throw new TypeError(`Invalid type: ${type}`);
    }
    if (!id) {
      throw new TypeError("id is required");
    }
    if (!hasIndexedDB) {
      return dbMaps[type].has(id);
    }
    const db = await this.ready;
    const objectStore = db.transaction([type], "readonly").objectStore(type);
    const range = IDBKeyRange.only(id);
    const result = await objectStore.openCursor(range);
    return !!result;
  },
  /**
   * Checks if a given id is an alias.
   *
   * @param {String} id The reference to check.
   * @return {Promise<Boolean>} Resolves with true if found.
   */
  async isAlias(id) {
    if (!id) {
      throw new TypeError("id is required");
    }
    if (!hasIndexedDB) {
      return dbMaps.alias.has(id);
    }
    const db = await this.ready;
    const objectStore = db
      .transaction(["alias"], "readonly")
      .objectStore("alias");
    const range = IDBKeyRange.only(id);
    const result = await objectStore.openCursor(range);
    return !!result;
  },
  /**
   * Resolves an alias to its corresponding reference id.
   *
   * @param {String} id The id of the alias to look up.
   * @return {Promise<String>} The id of the resolved reference.
   */
  async resolveAlias(id) {
    if (!id) {
      throw new TypeError("id is required");
    }
    if (!hasIndexedDB) {
      const result = dbMaps.alias.get(id);
      return result ? result.aliasOf : null;
    }
    const db = await this.ready;

    const objectStore = db
      .transaction("alias", "readonly")
      .objectStore("alias");
    const range = IDBKeyRange.only(id);
    const result = await objectStore.openCursor(range);
    return result ? result.value.aliasOf : result;
  },
  /**
   * Get a reference or alias out of the database.
   *
   * @param {String} type The type as per ALLOWED_TYPES.
   * @param {string} id The id for what to look up.
   * @return {Promise<Object?>} Resolves with the retrieved object, or null.
   */
  async get(type, id) {
    if (!ALLOWED_TYPES.has(type)) {
      throw new TypeError(`Invalid type: ${type}`);
    }
    if (!id) {
      throw new TypeError("id is required");
    }
    if (!hasIndexedDB) {
      return dbMaps[type].get(id) || null;
    }
    const db = await this.ready;
    const objectStore = db.transaction([type], "readonly").objectStore(type);
    const range = IDBKeyRange.only(id);
    const result = await objectStore.openCursor(range);
    return result ? result.value : result;
  },
  /**
   * Adds references and aliases to database. This is usually the data from
   * Specref's output (parsed JSON).
   *
   * @param {Object} data An object that contains references and aliases.
   */
  async addAll(data) {
    if (!data) {
      return;
    }
    const aliasesAndRefs = {
      alias: new Set(),
      reference: new Set(),
    };
    Object.keys(data)
      .filter(key => {
        if (typeof data[key] === "string") {
          let msg = `Legacy SpecRef entries are not supported: \`[[${key}]]\`. `;
          msg +=
            "Please update it to the new format at [specref repo](https://github.com/tobie/specref/)";
          pub("error", msg);
          return false;
        }
        return true;
      })
      .map(id => Object.assign({ id }, data[id]))
      .forEach(obj => {
        if (obj.aliasOf) {
          aliasesAndRefs.alias.add(obj);
        } else {
          aliasesAndRefs.reference.add(obj);
        }
      });
    const promisesToAdd = Object.keys(aliasesAndRefs)
      .map((/** @type {keyof typeof dbMaps} */ type) => {
        return Array.from(aliasesAndRefs[type]).map(details =>
          this.add(type, details)
        );
      })
      .reduce(flatten, []);
    await Promise.all(promisesToAdd);
  },
  /**
   * Adds a reference or alias to the database.
   *
   * @param {keyof typeof dbMaps} type The type as per ALLOWED_TYPES.
   * @param {object} details The object to store.
   */
  async add(type, details) {
    if (!ALLOWED_TYPES.has(type)) {
      throw new TypeError(`Invalid type: ${type}`);
    }
    if (typeof details !== "object") {
      throw new TypeError("details should be an object");
    }
    if (type === "alias" && !details.hasOwnProperty("aliasOf")) {
      throw new TypeError("Invalid alias object.");
    }
    if (!hasIndexedDB) {
      return dbMaps[type].set(details.id, details);
    }
    const db = await this.ready;
    const isInDB = await this.has(type, details.id);
    const store = db.transaction([type], "readwrite").objectStore(type);
    // update or add, depending of already having it in db
    return isInDB ? await store.put(details) : await store.add(details);
  },
  /**
   * Closes the underlying database.
   *
   * @return {Promise} Resolves after database closes.
   */
  async close() {
    const db = await this.ready;
    if (db) {
      db.close();
    }
  },

  /**
   * Clears the underlying database
   */
  async clear() {
    if (!hasIndexedDB) {
      dbMaps.alias.clear();
      dbMaps.reference.clear();
      return;
    }
    const db = await this.ready;
    const storeNames = [...ALLOWED_TYPES];
    const stores = await db.transaction(storeNames, "readwrite");
    const clearStorePromises = storeNames.map(name => {
      return stores.objectStore(name).clear();
    });
    await Promise.all(clearStorePromises);
  },
};
