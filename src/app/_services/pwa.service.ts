import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { InfoBarService } from './info-bar.service';

@Injectable({
  providedIn: 'root'
})
export class PwaService {

  // prompt: Event;
  prompt: Event;

  constructor(private _swUpdate: SwUpdate, private _infobarService: InfoBarService) {

    this._swUpdate.available.subscribe(() => {
        location.reload();
    });

    // Get the event
    window.addEventListener('beforeinstallprompt', event => {
      this.prompt = event;
      this.prompt.preventDefault();
    });

    // Hide the 'Install App' button
    window.addEventListener('appinstalled', () => {
      this.prompt = null;
      this._infobarService.show('Shoplistic is now installed', 3000);
    });

  }

  showInstallPrompt() {
    // @ts-ignore
    this.prompt.prompt();
    // @ts-ignore
    this.prompt.userChoice
    .then(choise => {
      if (choise.outcome === 'accepted') {
        this.prompt = null;
      } else {
        console.log('rejected');
        this._infobarService.show('Failed to install app', 3000);
      }
    });
  }

}
