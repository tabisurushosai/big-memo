import {
  createAppDataStorageAdapter,
  type KeyValueStoragePort,
  type StorageValue,
} from "./storageAdapter";

export const chromeLocalStorage: KeyValueStoragePort = {
  async get(key: string): Promise<StorageValue | undefined> {
    const result = await chrome.storage.local.get(key);
    return result[key];
  },
  async set(key: string, value: StorageValue): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
  },
};

export const chromeAppStorage = createAppDataStorageAdapter(chromeLocalStorage);
