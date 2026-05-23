import { normalizeData } from "../core/memo";
import type { AppData } from "../core/models";
import type { AppDataStorageAdapter } from "./storageAdapter";

export class AppRepository {
  constructor(private readonly storage: AppDataStorageAdapter) {}

  async load(): Promise<AppData> {
    const stored = await this.storage.load();
    const data = normalizeData(stored);

    if (!stored?.premium?.firstLaunchAt) {
      await this.save(data);
    }

    return data;
  }

  async save(data: AppData): Promise<void> {
    await this.storage.save(data);
  }
}
