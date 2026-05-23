import { normalizeData } from "../core/memo";
import type { AppData } from "../core/models";
import type { StorageAdapter } from "./storageAdapter";

export class AppRepository {
  constructor(private readonly storage: StorageAdapter<Partial<AppData>>) {}

  async load(): Promise<AppData> {
    return normalizeData(await this.storage.load());
  }

  async save(data: AppData): Promise<void> {
    await this.storage.save(data);
  }
}
