import type { AppData } from "../core/models";

export const APP_DATA_STORAGE_KEY = "bigMemoAppData";

export type StoredAppData = Partial<AppData>;

export type KeyValueStoragePort = {
  get<TValue>(key: string): Promise<TValue | undefined>;
  set<TValue>(key: string, value: TValue): Promise<void>;
};

export type StorageAdapter<TStored, TWritable = TStored> = {
  load(): Promise<TStored | undefined>;
  save(value: TWritable): Promise<void>;
};

export type AppDataStorageAdapter = StorageAdapter<StoredAppData, AppData>;

export function createKeyedStorageAdapter<TStored, TWritable = TStored>(
  storage: KeyValueStoragePort,
  key: string,
): StorageAdapter<TStored, TWritable> {
  return {
    load() {
      return storage.get<TStored>(key);
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
