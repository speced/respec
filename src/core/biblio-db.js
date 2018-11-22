/**
 * Module core/biblio-db
 *
 * Wraps IndexedDB, allowing the storage of references and aliases on the
 * client.
 *
 * It's a standalone module that can be imported into other modules.
 *
 */
/*globals IDBKeyRange, DOMException, console */
import { pub } from "./pubsubhub";
export const name = "core/biblio-db";

const ALLOWED_TYPES = new Set(["alias", "reference"]);
// Database initialization, tracked by "readyPromise"
const readyPromise = new Promise((resolve, reject) => {
  let request;
  try {
    request = window.indexedDB.open("respec-biblio2", 12);
  } catch (err) {
    return reject(err);
  }
  request.onerror = () => {
    reject(new DOMException(request.error.message, request.error.name));
  };
  request.onsuccess = () => {
    resolve(request.result);
  };
  request.onupgradeneeded = async () => {
    const db = request.result;
    Array.from(db.objectStoreNames).map(storeName =>
      db.deleteObjectStore(storeName)
    );
    const promisesToCreateSchema = [
      new Promise((resolve, reject) => {
        try {
          const store = db.createObjectStore("alias", { keyPath: "id" });
          store.createIndex("aliasOf", "aliasOf", { unique: false });
          store.transaction.oncomplete = resolve;
          store.transaction.onerror = reject;
        } catch (err) {
          reject(err);
        }
      }),
      new Promise((resolve, reject) => {
        try {
          const transaction = db.createObjectStore("reference", {
            keyPath: "id",
          }).transaction;
          transaction.oncomplete = resolve;
          transaction.onerror = reject;
        } catch (err) {
          reject(err);
        }
      }),
    ];
    try {
      await Promise.all(promisesToCreateSchema);
      resolve();
    } catch (err) {
      reject(err);
    }
  };
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
   * @return {Object?} The reference or null.
   */
  async find(id) {
    if (await this.isAlias(id)) {
      id = await this.resolveAlias(id);
    }
    return this.get("reference", id);
  },
  /**
   * Checks if the database has an id for a given type.
   *
   * @param {String} type One of the ALLOWED_TYPES.
   * @param {String} id The reference to find.
   * @return {Boolean} True if it has it, false otherwise.
   */
  async has(type, id) {
    if (!ALLOWED_TYPES.has(type)) {
      throw new TypeError("Invalid type: " + type);
    }
    if (!id) {
      throw new TypeError("id is required");
    }
    const db = await this.ready;
    return new Promise((resolve, reject) => {
      const objectStore = db.transaction([type], "readonly").objectStore(type);
      const range = IDBKeyRange.only(id);
      const request = objectStore.openCursor(range);
      request.onsuccess = () => {
        resolve(!!request.result);
      };
      request.onerror = () => {
        reject(new DOMException(request.error.message, request.error.name));
      };
    });
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
    return new Promise((resolve, reject) => {
      const objectStore = db
        .transaction(["alias"], "readonly")
        .objectStore("alias");
      const range = IDBKeyRange.only(id);
      const request = objectStore.openCursor(range);
      request.onsuccess = () => {
        resolve(!!request.result);
      };
      request.onerror = () => {
        reject(new DOMException(request.error.message, request.error.name));
      };
    });
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
    return new Promise((resolve, reject) => {
      const objectStore = db
        .transaction("alias", "readonly")
        .objectStore("alias");
      const range = IDBKeyRange.only(id);
      const request = objectStore.openCursor(range);
      request.onsuccess = () => {
        if (request.result === null) {
          return resolve(null);
        }
        resolve(request.result.value.aliasOf);
      };
      request.onerror = () => {
        reject(new DOMException(request.error.message, request.error.name));
      };
    });
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
      throw new TypeError("Invalid type: " + type);
    }
    if (!id) {
      throw new TypeError("id is required");
    }
    const db = await this.ready;
    return new Promise((resolve, reject) => {
      const objectStore = db.transaction([type], "readonly").objectStore(type);
      const range = IDBKeyRange.only(id);
      const request = objectStore.openCursor(range);
      request.onsuccess = () => {
        if (request.result === null) {
          return resolve(null);
        }
        resolve(request.result.value);
      };
      request.onerror = () => {
        reject(new DOMException(request.error.message, request.error.name));
      };
    });
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
        return Array.from(aliasesAndRefs[type]).map(details =>
          this.add(type, details)
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
      throw new TypeError("Invalid type: " + type);
    }
    if (typeof details !== "object") {
      throw new TypeError("details should be an object");
    }
    if (type === "alias" && !details.hasOwnProperty("aliasOf")) {
      throw new TypeError("Invalid alias object.");
    }
    const db = await this.ready;
    const isInDB = await this.has(type, details.id);
    return new Promise((resolve, reject) => {
      const store = db.transaction([type], "readwrite").objectStore(type);
      // update or add, depending of already having it in db
      const request = isInDB ? store.put(details) : store.add(details);
      request.onsuccess = resolve;
      request.onerror = () => {
        reject(new DOMException(request.error.message, request.error.name));
      };
    });
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
    const stores = await new Promise((resolve, reject) => {
      const transaction = db.transaction(storeNames, "readwrite");
      transaction.onerror = () => {
        reject(
          new DOMException(transaction.error.message, transaction.error.name)
        );
      };
      resolve(transaction);
    });
    const clearStorePromises = storeNames.map(name => {
      return new Promise(resolve => {
        const request = stores.objectStore(name).clear();
        request.onsuccess = resolve;
      });
    });
    Promise.all(clearStorePromises);
  },
};
