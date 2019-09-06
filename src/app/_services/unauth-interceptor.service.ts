import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
// import 'rxjs/add/operator/do'; // rxjs-compat Angular 6
import { catchError } from 'rxjs/operators'; // Angular 7+
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UnauthInterceptorService implements HttpInterceptor {

  constructor(private _router: Router, private _authService: AuthService) { }

  // Angular 6:
  // intercept(req, next) {

  //   return next.handle(req).do(null, (err: any) => {

  //     if (err instanceof HttpErrorResponse) {

  //       // TODO: Change this?
  //       if (err.status === 401 && err.error.logout !== false) {
  //         this._authService.logOut();
  //         this._router.navigate(['/login']);
  //       }

  //     }

  //   });

  // }

  // Angular 7+
  intercept(req: HttpRequest<any>, next: HttpHandler) {

    return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {

      if (err.status === 401 && err.error.logout !== false) {
        this._authService.logOut();
        this._router.navigate(['/login']);
      }

      const error = err.error.message || err.statusText;
      return throwError(error);

    }));

  }

}
