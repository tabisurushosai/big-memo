import type { AppData, StoredAppData } from "../core/models";
import {
  createKeyedStorageAdapter,
  type KeyValueStoragePort,
  type StorageAdapter,
} from "./storageAdapter";

export const APP_DATA_STORAGE_KEY = "bigMemoAppData";

export type AppDataStorageAdapter = StorageAdapter<StoredAppData, AppData>;

export function createAppDataStorageAdapter(
  storage: KeyValueStoragePort,
): AppDataStorageAdapter {
  return createKeyedStorageAdapter<StoredAppData, AppData>(
    storage,
    APP_DATA_STORAGE_KEY,
  );
}
