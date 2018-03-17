/**
 * A promise based interface to a key-value based indexedDB cache
 */

const databases = new Map();

export default class IDBCache {
  /**
   * @constructor
   * @param {string} name             name of database
   * @param {array} stores            name of stores
   * @param {object} Options
   *    @param {integer} version      database version
   *    @param {string} defaultStore  name of default store
   */
  constructor(name, stores = [], { version = 1, defaultStore }) {
    this.name = name;
    this.stores = typeof stores === "string" ? [stores] : stores;
    this.version = version;
    this.defaultStore = defaultStore || this.stores[0];
    if (!databases.has(name)) {
      const dbPromise = new Promise((resolve, reject) => {
        const request = window.indexedDB.open(this.name, this.version);
        request.onerror = () => reject(request.error);
        request.onupgradeneeded = () =>
          this.stores.forEach(storeName =>
            request.result.createObjectStore(storeName));
        request.onsuccess = () => resolve(request.result);
      });
      databases.set(this.name, dbPromise);
    }
  }

  /**
   * @private returns a promise to get an IDBObjectStore
   * @param {string} storeName      store name
   * @param {string} mode           IDBTransaction.mode
   */
  async ready(storeName, mode) {
    const db = await databases.get(this.name);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
      return resolve(transaction.objectStore(storeName));
    });
  }

  /**
   * @private returns a promise to get result of IDBRequest
   * @param {IDBRequest} request    IDBRequest interface
   */
  getResponse(request) {
    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * @method @async get a value of key from a given store
   * @param {string} key        object store record key
   * @param {string} storeName  store name
   */
  async get(key, storeName = this.defaultStore) {
    const store = await this.ready(storeName, "readonly");
    return await this.getResponse(store.get(key));
  }

  /**
   * @method @async set a value for a key in a given store
   * @param {string} key        object store record key
   * @param {any} value         value
   * @param {string} storeName  store name
   */
  async set(key, value, storeName = this.defaultStore) {
    const store = await this.ready(storeName, "readwrite");
    return await this.getResponse(store.put(value, key));
  }

  /**
   * @method @async remove a key-value pair from a given store
   * @param {string} key        object store record key
   * @param {string} storeName  store name
   */
  async remove(key, storeName = this.defaultStore) {
    const store = await this.ready(storeName, "readwrite");
    return await this.getResponse(store.delete(key));
  }

  /**
   * @method @async clear an object store
   * @param {string} storeName  store name
   */
  async clear(storeName = this.defaultStore) {
    const store = await this.ready(storeName, "readwrite");
    return await this.getResponse(store.clear());
  }

  /**
   * @method @async retrieves all record keys for all objects in the object store
   * @param {string} key        object store record key
   * @param {string} storeName  store name
   */
  async keys(storeName = this.defaultStore) {
    const store = await this.ready(storeName, "readonly");
    return await this.getResponse(store.getAllKeys());
  }
}
