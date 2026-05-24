import {
  createAppDataStorageAdapter,
  type KeyValueStoragePort,
} from "./storageAdapter";

export const chromeLocalStorage: KeyValueStoragePort = {
  async get<T>(key: string): Promise<T | undefined> {
    const result = await chrome.storage.local.get(key);
    return result[key] as T | undefined;
  },
  async set<T>(key: string, value: T): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
  },
};

export const chromeAppStorage = createAppDataStorageAdapter(chromeLocalStorage);
