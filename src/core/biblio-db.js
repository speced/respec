/**
 * Module core/biblio-db
 *
 * Wraps IndexedDB, allowing the storage of references and aliases on the
 * client.
 *
 * It's a standalone module that can be imported into other modules.
 *
 */
/* globals IDBKeyRange */
import { openDB } from "idb";
import { pub } from "./pubsubhub";
export const name = "core/biblio-db";

const ALLOWED_TYPES = new Set(["alias", "reference"]);
// Database initialization, tracked by "readyPromise"
const readyPromise = openDB("respec-biblio2", 12, {
  upgrade(db) {
    Array.from(db.objectStoreNames).map(storeName =>
      db.deleteObjectStore(storeName)
    );
    const store = db.createObjectStore("alias", { keyPath: "id" });
    store.createIndex("aliasOf", "aliasOf", { unique: false });
    db.createObjectStore("reference", { keyPath: "id" });
  },
});

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
    const db = await this.ready;
    const objectStore = db.transaction([type], "readonly").objectStore(type);
    const range = IDBKeyRange.only(id);
    return !!(await objectStore.openCursor(range));
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
    const db = await this.ready;
    const objectStore = db
      .transaction(["alias"], "readonly")
      .objectStore("alias");
    const range = IDBKeyRange.only(id);
    return !!(await objectStore.openCursor(range));
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
   * @param {[type]} id The id for what to look up.
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
      .reduce((collector, obj) => {
        if (obj.aliasOf) {
          collector.alias.add(obj);
        } else {
          collector.reference.add(obj);
        }
        return collector;
      }, aliasesAndRefs);
    const promisesToAdd = Object.keys(aliasesAndRefs)
      .map(type => {
        return Array.from(aliasesAndRefs[type]).map(
          async details => await this.add(type, details)
        );
      })
      .reduce((collector, promises) => collector.concat(promises), []);
    await Promise.all(promisesToAdd);
  },
  /**
   * Adds a reference or alias to the database.
   *
   * @param {String} type The type as per ALLOWED_TYPES.
   * @param {String} details The object to store.
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
    const store = db.transaction([type], "readwrite").objectStore(type);
    // update or add, depending of already having it in db
    const request = isInDB ? store.put(details) : store.add(details);
    return await request;
  },
  /**
   * Closes the underlying database.
   *
   * @return {Promise} Resolves after database closes.
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
    const stores = await db.transaction(storeNames, "readwrite");
    const clearStorePromises = storeNames.map(async name => {
      return await stores.objectStore(name).clear();
    });
    await Promise.all(clearStorePromises);
  },
};
