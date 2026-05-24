export type StorageKey = string;
export type StorageValue = unknown;

export type KeyValueStoragePort<
  TStoredValue = StorageValue,
  TWritableValue = TStoredValue,
> = {
  get(key: StorageKey): Promise<TStoredValue | undefined>;
  set(key: StorageKey, value: TWritableValue): Promise<void>;
};

export type StorageAdapter<
  TStoredValue = StorageValue,
  TWritableValue = TStoredValue,
> = {
  load(): Promise<TStoredValue | undefined>;
  save(value: TWritableValue): Promise<void>;
};

export function createKeyedStorageAdapter<
  TStoredValue = StorageValue,
  TWritableValue = TStoredValue,
>(
  storage: KeyValueStoragePort<TStoredValue, TWritableValue>,
  key: StorageKey,
): StorageAdapter<TStoredValue, TWritableValue> {
  return {
    async load() {
      return storage.get(key);
    },
    save(value) {
      return storage.set(key, value);
    },
  };
}
