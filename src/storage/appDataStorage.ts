import type { AppData } from "../core/models";
import {
  createKeyedStorageAdapter,
  type KeyValueStoragePort,
  type StorageValue,
  type StorageAdapter,
} from "./storageAdapter";

export const APP_DATA_STORAGE_KEY = "bigMemoAppData";

export type AppDataStorageAdapter = StorageAdapter<StorageValue, AppData>;

export function createAppDataStorageAdapter(
  storage: KeyValueStoragePort,
): AppDataStorageAdapter {
  return createKeyedStorageAdapter<AppData>(storage, APP_DATA_STORAGE_KEY);
}
