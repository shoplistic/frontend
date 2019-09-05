import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private _authService: AuthService) {
  }

  intercept(req, next) {

    if ((req.url as string).includes(environment.apiUrl)) {

      const tokenizedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this._authService.getToken()}`
        }
      });

      return next.handle(tokenizedReq);

    } else {

      next.handle(req.clone());

    }

  }

}
