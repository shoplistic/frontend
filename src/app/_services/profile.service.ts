import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserData, PasswordReset } from '../_classes/user-data';
import { environment } from '../../environments/environment';
import { resolve as urlResolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private _http: HttpClient) { }

  get() {

    return this._http.get<UserData>(urlResolve(environment.apiUrl, 'profile'));

  }

  resetPassword(np: PasswordReset) {

    return this._http.patch(urlResolve(environment.apiUrl, 'profile/password'), np);

  }

  deleteAccount() {

    return this._http.delete(urlResolve(environment.apiUrl, 'user'));

  }

}
