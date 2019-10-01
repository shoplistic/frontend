import { Injectable } from '@angular/core';
import { StatsService } from './stats.service';

@Injectable({
  providedIn: 'root'
})
export class UpdaterService {

  private newVersion: string = null;
  private storageKey = 'version';

  constructor(private _stats: StatsService) { }

  public async updateAvailable(): Promise<boolean> {

    const latest = await this.getAvailable();
    const current = localStorage.getItem(this.storageKey);

    this.newVersion = latest;

    return latest !== current;

  }

  private async getAvailable(): Promise<string> {

    return new Promise((resolve, reject) => {

      this._stats.version().subscribe(
        res => {
          resolve(res.frontend.version);
        },
        _err => {
          reject(new Error('Failed to get latest version info'));
        }
      );

    });

  }

  public async update(): Promise<boolean> {

    // console.log('Updating...');

    if (!this.newVersion) {
        this.newVersion = await this.getAvailable();
    }

    let success = true;
    success = success && await this.clearCache();
    success = success && await this.updateSW();
    success = success && Boolean(this.newVersion);

    if (success) {
      localStorage.setItem(this.storageKey, this.newVersion);
      location.reload(true);
    }

    return success;
  }

  private async clearCache(): Promise<boolean> {

    let success = true;

    const keys = await caches.keys();

    for (const key of keys) {
      success = success && await caches.delete(key);
    }

    return success;

  }

  private async updateSW(): Promise<boolean> {

    const swr: ServiceWorkerRegistration | undefined = await navigator.serviceWorker.getRegistration();

    if (swr) {

      const newswr = await swr.update();
      // @ts-ignore
      return !!newswr;

    }

    // No service worker to update
    return true;

  }

}
