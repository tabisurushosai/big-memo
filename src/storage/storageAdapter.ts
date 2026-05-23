export type StorageAdapter<T> = {
  load(): Promise<T | undefined>;
  save(value: T): Promise<void>;
};
