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

export function createKeyedStorageAdapter<TWritable = StorageValue>(
  storage: KeyValueStoragePort,
  key: StorageKey,
): StorageAdapter<StorageValue, TWritable> {
  return {
    async load() {
      return storage.get(key);
    },
    save(value) {
      return storage.set(key, value);
    },
  };
}
