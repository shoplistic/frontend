import { Component, AfterViewInit, ViewChild, ElementRef, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './_services/auth.service';
import { PwaService } from './_services/pwa.service';
import { UpdaterService } from '@service/updater.service';
import { InfoBarService } from '@service/info-bar.service'
import { SettingsService } from '@service/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit, DoCheck {

  @ViewChild('sidebar', { static: true }) sidebar: ElementRef;
  @ViewChild('mdll', { static: true }) mdll: ElementRef;

  online = false;
  loggedIn = false;
  isAdmin = false;
  title = 'Shoplistic';

  constructor(
    private _auth: AuthService,
    private _updater: UpdaterService,
    private _infoBar: InfoBarService,
    private _settings: SettingsService,
    public router: Router,
    public pwa: PwaService
  ) {

    this.online = navigator.onLine;

    // TODO: Alert the user instead of just updating?
    if (this._settings.settings.automaticUpdates.get()) {

      (async () => {
        if (await this._updater.updateAvailable()) {
          if (await this._updater.update()) {
            console.log('Updated successfully');
          } else {
            this._infoBar.show('Failed to update');
          }
        }
      })().catch(e => {
        console.warn('Failed to check for updates!', e);
        this._infoBar.show('Failed to check for updates');
      });

    }

  }

  ngAfterViewInit() {

    this.sidebar.nativeElement.addEventListener('click', () => {
      // routerLink does not act like a normal link, hence not closing the nav.
      this.mdll.nativeElement.MaterialLayout.toggleDrawer();
    });

  }

  ngDoCheck() {
    this.online = navigator.onLine;
    this.loggedIn = !!localStorage.getItem('token');
    this.isAdmin = !!localStorage.getItem('admin');

    switch (this.router.url) {

      case '/':
        this.title = 'Shopping list';
        break;

      case '/add':
        this.title = 'Add an item';
        break;

      case '/scanner':
        this.title = 'Scanner';
        break;

      case '/profile':
        this.title = 'Your profile';
        break;

      case '/settings':
        this.title = 'Settings';
        break;

      case '/bcds':
        this.title = 'Add to database';
        break;

      case '/stats':
        this.title = 'Statistics / Info';
        break;

      case '/about':
        this.title = 'About';
        break;

      default:
        this.title = 'Shoplistic';
        break;

    }

  }

  async reloadApp() {
    // location.reload(true);
    if (!await this._updater.update()) {
      this._infoBar.show('Failed to update');
    }
  }

  logOut() {
    this._auth.logOut();
    this.router.navigate(['/login']);
  }

  showInstallPrompt() {

    this.pwa.showInstallPrompt();

  }

}
