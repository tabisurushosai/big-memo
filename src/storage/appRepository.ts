import { normalizeData } from "../core/memo";
import { isRecord } from "../core/guards";
import type { AppData } from "../core/models";
import type { AppDataStorageAdapter } from "./appDataStorage";

export class AppRepository {
  constructor(private readonly storage: AppDataStorageAdapter) {}

  async load(): Promise<AppData> {
    const stored = await this.storage.load();
    const data = normalizeData(stored);

    if (!hasStoredFirstLaunchAt(stored)) {
      await this.save(data);
    }

    return data;
  }

  async save(data: AppData): Promise<void> {
    await this.storage.save(data);
  }
}

function hasStoredFirstLaunchAt(value: unknown): boolean {
  if (!isRecord(value) || !isRecord(value["premium"])) {
    return false;
  }

  return Boolean(value["premium"]["firstLaunchAt"]);
}
