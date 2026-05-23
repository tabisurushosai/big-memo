import {
  createAppDataStorageAdapter,
  type KeyValueStorageAdapter,
} from "./storageAdapter";

export const chromeLocalStorage: KeyValueStorageAdapter = {
  async load<T>(key: string) {
    const result = await chrome.storage.local.get(key);
    return result[key] as T | undefined;
  },
  async save<T>(key: string, value: T) {
    await chrome.storage.local.set({ [key]: value });
  },
};

export const chromeAppStorage = createAppDataStorageAdapter(chromeLocalStorage);
