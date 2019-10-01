import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { ScannerComponent } from './scanner/scanner.component';
import { ListComponent } from './list/list.component';
import { AddItemComponent } from './add-item/add-item.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { Error404Component } from './error404/error404.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AboutComponent } from './about/about.component';
import { BcdsComponent } from './bcds/bcds.component';
import { StatsComponent } from './stats/stats.component';
import { DevComponent } from './dev/dev.component';

// Guards
import { AuthGuard } from '@guard/auth.guard';
import { AdminGuard } from '@guard/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add',
    component: AddItemComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'scanner',
    component: ScannerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'bcds',
    component: BcdsComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'stats',
    component: StatsComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'devcompononent',
    component: DevComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    component: Error404Component,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
