import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import 'rxjs/add/operator/do'; // rxjs-compat

@Injectable({
  providedIn: 'root'
})
export class UnauthInterceptorService implements HttpInterceptor {

  constructor(private _router: Router, private _authService: AuthService) { }

  intercept(req, next) {

    return next.handle(req).do(null, (err: any) => {

      if (err instanceof HttpErrorResponse) {

        // TODO: Change this?
        if (err.status === 401 && err.error.logout !== false) {
          this._authService.logOut();
          this._router.navigate(['/login']);
        }

      }

    });

  }

}
