import type { AppData } from "../core/models";

export const APP_DATA_STORAGE_KEY = "bigMemoAppData";

export type StoredAppData = Partial<AppData>;

export type KeyValueStorageAdapter = {
  load<T>(key: string): Promise<T | undefined>;
  save<T>(key: string, value: T): Promise<void>;
};

export type AppDataStorageAdapter = {
  load(): Promise<StoredAppData | undefined>;
  save(value: AppData): Promise<void>;
};

export function createAppDataStorageAdapter(
  storage: KeyValueStorageAdapter,
): AppDataStorageAdapter {
  return {
    load() {
      return storage.load<StoredAppData>(APP_DATA_STORAGE_KEY);
    },
    save(value) {
      return storage.save(APP_DATA_STORAGE_KEY, value);
    },
  };
}
