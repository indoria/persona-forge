const StorageDrivers = (function() {

    function localStorageDriver() {
        return {
            setItem: function(key, value) {
                return new Promise((resolve, reject) => {
                    try {
                        localStorage.setItem(key, value);
                        resolve(true);
                    } catch (e) {
                        reject(e);
                    }
                });
            },
            getItem: function(key) {
                return new Promise((resolve, reject) => {
                    try {
                        const item = localStorage.getItem(key);
                        resolve(item);
                    } catch (e) {
                        reject(e);
                    }
                });
            },
            removeItem: function(key) {
                return new Promise((resolve, reject) => {
                    try {
                        localStorage.removeItem(key);
                        resolve(true);
                    } catch (e) {
                        reject(e);
                    }
                });
            },
            clear: function() {
                return new Promise((resolve, reject) => {
                    try {
                        localStorage.clear();
                        resolve(true);
                    } catch (e) {
                        reject(e);
                    }
                });
            },
            key: function(index) {
                return new Promise((resolve, reject) => {
                    try {
                        const k = localStorage.key(index);
                        resolve(k);
                    } catch (e) {
                        reject(e);
                    }
                });
            },
            length: function() {
                return new Promise((resolve, reject) => {
                    try {
                        const len = localStorage.length;
                        resolve(len);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        };
    }

    function sessionStorageDriver() {
        return {
            setItem: function(key, value) {
                return new Promise((resolve, reject) => {
                    try {
                        sessionStorage.setItem(key, value);
                        resolve(true);
                    } catch (e) {
                        reject(e);
                    }
                });
            },
            getItem: function(key) {
                return new Promise((resolve, reject) => {
                    try {
                        const item = sessionStorage.getItem(key);
                        resolve(item);
                    } catch (e) {
                        reject(e);
                    }
                });
            },
            removeItem: function(key) {
                return new Promise((resolve, reject) => {
                    try {
                        sessionStorage.removeItem(key);
                        resolve(true);
                    } catch (e) {
                        reject(e);
                    }
                });
            },
            clear: function() {
                return new Promise((resolve, reject) => {
                    try {
                        sessionStorage.clear();
                        resolve(true);
                    } catch (e) {
                        reject(e);
                    }
                });
            },
            key: function(index) {
                return new Promise((resolve, reject) => {
                    try {
                        const k = sessionStorage.key(index);
                        resolve(k);
                    } catch (e) {
                        reject(e);
                    }
                });
            },
            length: function() {
                return new Promise((resolve, reject) => {
                    try {
                        const len = sessionStorage.length;
                        resolve(len);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        };
    }

    function indexedDBDriver(dbName = 'MarkdownCacheDB', storeName = 'markdown_files', version = 1) {
        let db = null;

        async function openDB() {
            return new Promise((resolve, reject) => {
                if (db) {
                    resolve(db);
                    return;
                }

                const request = indexedDB.open(dbName, version);

                request.onupgradeneeded = (event) => {
                    const dbInstance = event.target.result;
                    if (!dbInstance.objectStoreNames.contains(storeName)) {
                        dbInstance.createObjectStore(storeName);
                    }
                };

                request.onsuccess = (event) => {
                    db = event.target.result;
                    resolve(db);
                };

                request.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        }

        async function setItem(key, value) {
            try {
                const dbInstance = await openDB();
                const transaction = dbInstance.transaction(storeName, 'readwrite');
                const store = transaction.objectStore(storeName);
                await new Promise((resolve, reject) => {
                    const request = store.put(value, key);
                    request.onsuccess = () => resolve(true);
                    request.onerror = (event) => reject(event.target.error);
                });
                return true;
            } catch (e) {
                return false;
            }
        }

        async function getItem(key) {
            try {
                const dbInstance = await openDB();
                const transaction = dbInstance.transaction(storeName, 'readonly');
                const store = transaction.objectStore(storeName);
                return await new Promise((resolve, reject) => {
                    const request = store.get(key);
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = (event) => reject(event.target.error);
                });
            } catch (e) {
                return null;
            }
        }

        async function removeItem(key) {
            try {
                const dbInstance = await openDB();
                const transaction = dbInstance.transaction(storeName, 'readwrite');
                const store = transaction.objectStore(storeName);
                await new Promise((resolve, reject) => {
                    const request = store.delete(key);
                    request.onsuccess = () => resolve(true);
                    request.onerror = (event) => reject(event.target.error);
                });
                return true;
            } catch (e) {
                return false;
            }
        }

        async function clear() {
            try {
                const dbInstance = await openDB();
                const transaction = dbInstance.transaction(storeName, 'readwrite');
                const store = transaction.objectStore(storeName);
                await new Promise((resolve, reject) => {
                    const request = store.clear();
                    request.onsuccess = () => resolve(true);
                    request.onerror = (event) => reject(event.target.error);
                });
                return true;
            } catch (e) {
                return false;
            }
        }

        async function key(index) {
            try {
                const dbInstance = await openDB();
                const transaction = dbInstance.transaction(storeName, 'readonly');
                const store = transaction.objectStore(storeName);
                const keys = await new Promise((resolve, reject) => {
                    const request = store.getAllKeys();
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = (event) => reject(event.target.error);
                });
                return keys[index] || null;
            } catch (e) {
                return null;
            }
        }

        async function length() {
            try {
                const dbInstance = await openDB();
                const transaction = dbInstance.transaction(storeName, 'readonly');
                const store = transaction.objectStore(storeName);
                return await new Promise((resolve, reject) => {
                    const request = store.count();
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = (event) => reject(event.target.error);
                });
            } catch (e) {
                return 0;
            }
        }

        return {
            setItem,
            getItem,
            removeItem,
            clear,
            key,
            length
        };
    }

    return {
        localStorage: localStorageDriver,
        sessionStorage: sessionStorageDriver,
        indexedDB: indexedDBDriver
    };
})();

const MarkdownCache = (function() {
    let _storageDriver = null;
    const CACHE_PREFIX = "markdown_cache_";

    function init(driver) {
        if (!driver || typeof driver.setItem !== 'function' || typeof driver.getItem !== 'function') {
            _storageDriver = null;
            return;
        }
        _storageDriver = driver;
    }

    async function set(filePath, content) {
        if (!_storageDriver) {
            return false;
        }
        const key = CACHE_PREFIX + filePath;
        try {
            return await _storageDriver.setItem(key, content);
        } catch (e) {
            return false;
        }
    }

    async function get(filePath) {
        if (!_storageDriver) {
            return null;
        }
        const key = CACHE_PREFIX + filePath;
        try {
            return await _storageDriver.getItem(key);
        } catch (e) {
            return null;
        }
    }

    async function remove(filePath) {
        if (!_storageDriver) {
            return false;
        }
        const key = CACHE_PREFIX + filePath;
        try {
            return await _storageDriver.removeItem(key);
        } catch (e) {
            return false;
        }
    }

    async function clear() {
        if (!_storageDriver) {
            return false;
        }
        try {
            // If the driver has a direct clear method, use it
            if (typeof _storageDriver.clear === 'function') {
                return await _storageDriver.clear();
            } else {
                // Fallback for drivers that don't have a direct clear scoped to prefix
                let success = true;
                const keysToRemove = [];
                const len = await _storageDriver.length();
                for (let i = 0; i < len; i++) {
                    const key = await _storageDriver.key(i);
                    if (key && key.startsWith(CACHE_PREFIX)) {
                        keysToRemove.push(key);
                    }
                }

                for (const key of keysToRemove) {
                    if (!await _storageDriver.removeItem(key)) {
                        success = false;
                    }
                }
                return success;
            }
        } catch (e) {
            return false;
        }
    }

    return {
        init: init,
        set: set,
        get: get,
        remove: remove,
        clear: clear
    };
})();