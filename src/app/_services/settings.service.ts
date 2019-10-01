import { Injectable } from '@angular/core';
import { Setting } from '@class/setting';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  public settings /*: ISettings*/ = {
    icaApi: new Setting(
      'ica-api',
      'Boolean',
      'ICA API',
      false,
      'Enable the ICA API. Scan times may be slower.'
    ),
    automaticUpdates: new Setting(
        'automatic-updates',
        'Boolean',
        'Automatic Updates',
        true,
        'Enable automatic updates. Turning this off may lead to the app not working.'
    ),
    // darkMode: new Setting(
    //     'dark-mode',
    //     'Boolean',
    //     'Dark Theme',
    //     false,
    //     'Join the dark side. Enable a darker theme.'
    // ),
  };

  public reset() {
    // tslint:disable-next-line:forin
    for (const s in this.settings) {
      this.settings[s].reset();
    }
  }

}
