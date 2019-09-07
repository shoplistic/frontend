import { Component } from '@angular/core';
import { SettingsService } from '../_services/settings.service';
import { Setting } from '../_classes/setting';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  settings: Setting[] = [];

  constructor(_settings: SettingsService) {
    // tslint:disable-next-line:forin
    for (const s in _settings.settings) {
      this.settings.push(_settings.settings[s]);
    }
  }

}
