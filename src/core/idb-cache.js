/**
 * A promise based interface to a key-value based indexedDB cache
 */

const databases = new Map();

export default class IDBCache {
  /**
   * @constructor
   * @param {string} name             name of database
   * @param {array} stores            array of names of stores
   * @param {object} Options
   *    @param {integer} version      database version
   *    @param {string} defaultStore  name of default store
   */
  constructor(
    name,
    stores,
    { version, defaultStore } = { version: 1, defaultStore: null }
  ) {
    this.name = name;
    if (!Array.isArray(stores) || stores.length < 1) {
      throw new TypeError("`stores` must be an array of length atleast 1");
    }
    this.stores = [...stores];
    this.version = version;
    this.defaultStore = defaultStore || this.stores[0];
    if (!databases.has(name)) {
      const dbPromise = new Promise((resolve, reject) => {
        const request = window.indexedDB.open(this.name, this.version);
        request.onerror = () => {
          reject(new DOMException(request.error.message, request.error.name));
        };
        request.onupgradeneeded = () => {
          this.stores.forEach(storeName =>
            request.result.createObjectStore(storeName));
        };
        request.onsuccess = () => resolve(request.result);
      });
      databases.set(this.name, dbPromise);
    }
  }

  get ready() {
    return new Promise(async (resolve) => {
      const db = await databases.get(this.name);
      if (db instanceof IDBDatabase) {
        return resolve();
      }
      throw new Error(`The database ${this.name} is gone!`);
    });
  }

  /**
   * @method @async get a value of key from a given store
   * @param {string} key        object store record key
   * @param {string} storeName  store name
   */
  async match(key, storeName = this.defaultStore) {
    const db = await databases.get(this.name);
    const store = await getStore(db, storeName, "readonly");
    return await getResponse(store.get(key));
  }

  /**
   * @method @async set a value for a key in a given store
   * @param {string} key        object store record key
   * @param {any} value         value
   * @param {string} storeName  store name
   */
  async put(key, value, storeName = this.defaultStore) {
    const db = await databases.get(this.name);
    const store = await getStore(db, storeName, "readwrite");
    return await getResponse(store.put(value, key));
  }

  /**
   * @method @async remove a key-value pair from a given store
   * @param {string} key        object store record key
   * @param {string} storeName  store name
   */
  async remove(key, storeName = this.defaultStore) {
    const db = await databases.get(this.name);
    const store = await getStore(db, storeName, "readwrite");
    return await getResponse(store.delete(key));
  }

  /**
   * @method @async clear an object store
   * @param {string} storeName  store name
   */
  async clear(storeName = this.defaultStore) {
    const db = await databases.get(this.name);
    const store = await getStore(db, storeName, "readwrite");
    return await getResponse(store.clear());
  }

  /**
   * @method @async retrieves all record keys for all objects in the object store
   * @param {string} key        object store record key
   * @param {string} storeName  store name
   */
  async keys(storeName = this.defaultStore) {
    const db = await databases.get(this.name);
    const store = await getStore(db, storeName, "readonly");
    return await getResponse(store.getAllKeys());
  }
}

/**
 * promises to get result of IDBRequest
 * @param {IDBRequest} request    IDBRequest interface
 */
function getResponse(request) {
  return new Promise((resolve, reject) => {
    request.onerror = () => {
      reject(new DOMException(request.error.message, request.error.name));
    };
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * promises to get an IDBObjectStore
 * @param {IDBDatabase} db        IDBDatabase
 * @param {string} storeName      store name
 * @param {string} mode           IDBTransaction.mode
 */
function getStore(db, storeName, mode) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    transaction.onerror = () => {
      reject(new DOMException(transaction.error.message, transaction.error.name));
    };
    resolve(transaction.objectStore(storeName));
  });
}
