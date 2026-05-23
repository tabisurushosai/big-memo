import type { AppData } from "../core/models";
import type { StorageAdapter } from "./storageAdapter";

const STORAGE_KEY = "bigMemoAppData";

export const chromeAppStorage: StorageAdapter<Partial<AppData>> = {
  async load() {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    return result[STORAGE_KEY] as Partial<AppData> | undefined;
  },
  async save(value) {
    await chrome.storage.local.set({ [STORAGE_KEY]: value });
  },
};
