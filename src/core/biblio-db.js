// @ts-check
/**
 * Module core/biblio-db
 *
 * Wraps IndexedDB, allowing the storage of references and aliases on the
 * client.
 *
 * It's a standalone module that can be imported into other modules.
 *
 */
import { idb } from "./import-maps.js";

export const name = "core/biblio-db";

/**
 * @typedef {keyof BiblioDb} AllowedType
 * @type {Set<AllowedType>}
 */
const ALLOWED_TYPES = new Set(["alias", "reference"]);
/* Database initialization tracker */
const readyPromise = openIdb();

/**
 * @typedef {object} BiblioDb
 *
 * @property {object} alias Object store for alias objects
 * @property {string} alias.key
 * @property {object} alias.value
 * @property {object} alias.indexes
 * @property {string} alias.aliasOf
 *
 * @property {object} reference Object store for reference objects
 * @property {string} reference.key
 * @property {object} reference.value
 *
 * @returns {Promise<import("idb").IDBPDatabase<BiblioDb>>}
 */
async function openIdb() {
  return await idb.openDB("respec-biblio2", 12, {
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
   * @param {AllowedType} type One of the ALLOWED_TYPES.
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
    const db = await this.ready;
    const objectStore = db.transaction(type, "readonly").store;
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
    return await this.has("alias", id);
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
    const db = await this.ready;

    const objectStore = db.transaction("alias", "readonly").store;
    const range = IDBKeyRange.only(id);
    const result = await objectStore.openCursor(range);
    return result ? result.value.aliasOf : result;
  },
  /**
   * Get a reference or alias out of the database.
   *
   * @param {AllowedType} type The type as per ALLOWED_TYPES.
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
    const db = await this.ready;
    const objectStore = db.transaction(type, "readonly").store;
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
    const aliasesAndRefs = { alias: [], reference: [] };
    for (const id of Object.keys(data)) {
      const obj = { id, ...data[id] };
      if (obj.aliasOf) {
        aliasesAndRefs.alias.push(obj);
      } else {
        aliasesAndRefs.reference.push(obj);
      }
    }
    const promisesToAdd = [...ALLOWED_TYPES].flatMap(type => {
      return aliasesAndRefs[type].map(details => this.add(type, details));
    });
    await Promise.all(promisesToAdd);
  },
  /**
   * Adds a reference or alias to the database.
   *
   * @param {AllowedType} type The type as per ALLOWED_TYPES.
   * @param {Object} details The object to store.
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
    const db = await this.ready;
    const isInDB = await this.has(type, details.id);
    const store = db.transaction(type, "readwrite").store;
    // update or add, depending of already having it in db
    return isInDB ? await store.put(details) : await store.add(details);
  },
  /**
   * Closes the underlying database.
   *
   * @return {Promise<void>} Resolves after database closes.
   */
  async close() {
    const db = await this.ready;
    db.close();
  },

  /**
   * Clears the underlying database
   */
  async clear() {
    const db = await this.ready;
    const storeNames = [...ALLOWED_TYPES];
    const stores = db.transaction(storeNames, "readwrite");
    const clearStorePromises = storeNames.map(name => {
      return stores.objectStore(name).clear();
    });
    await Promise.all(clearStorePromises);
  },
};
