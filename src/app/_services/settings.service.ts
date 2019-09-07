import { Injectable } from '@angular/core';
import { Setting } from '../_classes/setting';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  public settings /*: ISettings*/ = {
    // darkMode: new Setting('dark-mode', 'Boolean', 'Dark Theme', false, 'Join the dark side. Enable a darker theme.'),
    icaApi: new Setting(
      'ica-api',
      'Boolean',
      'ICA API',
      false,
      'Enable the ICA API. Scan times may be slower.'
    )
  };

  public reset() {
    // tslint:disable-next-line:forin
    for (const s in this.settings) {
      this.settings[s].reset();
    }
  }

}
