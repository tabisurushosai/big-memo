import type { AppData, StoredAppData } from "../core/models";

export const APP_DATA_STORAGE_KEY = "bigMemoAppData";

export type StorageKey = string;
export type StorageValue = unknown;

export type KeyValueStoragePort = {
  get(key: StorageKey): Promise<StorageValue | undefined>;
  set(key: StorageKey, value: StorageValue): Promise<void>;
};

export type StorageAdapter<TStored, TWritable = TStored> = {
  load(): Promise<TStored | undefined>;
  save(value: TWritable): Promise<void>;
};

export type AppDataStorageAdapter = StorageAdapter<StoredAppData, AppData>;

export function createKeyedStorageAdapter<TStored, TWritable = TStored>(
  storage: KeyValueStoragePort,
  key: StorageKey,
): StorageAdapter<TStored, TWritable> {
  return {
    async load() {
      return (await storage.get(key)) as TStored | undefined;
    },
    save(value) {
      return storage.set(key, value);
    },
  };
}

export function createAppDataStorageAdapter(
  storage: KeyValueStoragePort,
): AppDataStorageAdapter {
  return createKeyedStorageAdapter<StoredAppData, AppData>(
    storage,
    APP_DATA_STORAGE_KEY,
  );
}
