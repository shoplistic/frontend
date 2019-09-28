import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private _router: Router) { }

  canActivate(): boolean | UrlTree {

    if (!!localStorage.getItem('admin')) {
        return true;
    } else {
        return this._router.parseUrl('/');
    }

  }

}
