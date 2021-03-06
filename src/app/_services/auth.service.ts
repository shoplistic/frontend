import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserLogin, UserLoginResponse } from '@class/user-login';
import { UserRegister, UserRegisterResponse } from '@class/user-register';
import { environment } from '@env/environment';
import { resolve as urlResolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient) { }

  login(user: UserLogin) {
    return this._http.post<UserLoginResponse>(urlResolve(environment.apiUrl, 'auth'), user);
  }

  register(user: UserRegister) {
    return this._http.post<UserRegisterResponse>(urlResolve(environment.apiUrl, 'user'), user);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logOut() {
    localStorage.clear();
  }

  getToken() {
    return localStorage.getItem('token');
  }

}
