import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScannerComponent } from './scanner/scanner.component';
import { ListComponent } from './list/list.component';
import { AddItemComponent } from './add-item/add-item.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Error404Component } from './error404/error404.component';
import { InfoBarComponent } from './info-bar/info-bar.component';
import { AboutComponent } from './about/about.component';
import { BcdsComponent } from './bcds/bcds.component';
import { StatsComponent } from './stats/stats.component';
import { DevComponent } from './dev/dev.component';

// Services
import { AuthService } from './_services/auth.service';
import { BcdsService } from './_services/bcds.service';
import { ShoppingListService } from './_services/shopping-list.service';
import { ProfileService } from './_services/profile.service';
import { InfoBarService } from './_services/info-bar.service';
import { PwaService } from './_services/pwa.service';
import { ThemeService } from './_services/theme.service';
import { TokenInterceptorService } from './_services/token-interceptor.service';
import { UnauthInterceptorService } from './_services/unauth-interceptor.service';
import { StatsService } from './_services/stats.service';
import { SettingsService } from './_services/settings.service';
import { UpdaterService } from './_services/updater.service';

// Guards
import { AuthGuard } from './_guards/auth.guard';
import { AdminGuard } from './_guards/admin.guard';

// Service worker
import { ServiceWorkerModule } from '@angular/service-worker';

// Environment
import { environment } from '../environments/environment';

// reCaptcha
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha';

@NgModule({
  declarations: [
    AppComponent,
    ScannerComponent,
    ListComponent,
    AddItemComponent,
    ProfileComponent,
    SettingsComponent,
    Error404Component,
    LoginComponent,
    RegisterComponent,
    InfoBarComponent,
    AboutComponent,
    BcdsComponent,
    StatsComponent,
    DevComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  providers: [
    AuthService,
    BcdsService,
    PwaService,
    ThemeService,
    ShoppingListService,
    ProfileService,
    InfoBarService,
    StatsService,
    SettingsService,
    UpdaterService,
    AuthGuard,
    AdminGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
