import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { resolve as urlResolve } from 'url';
import { ShoppingListItem, IShoppingListItem } from '@class/shopping-list-item';
import { Bcds } from '@class/bcds';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  constructor(private _http: HttpClient) { }

  getList() {

    return this._http.get<IShoppingListItem[]>(urlResolve(environment.apiUrl, 'shoppinglist'));

  }

  add(item: ShoppingListItem) {

    return this._http.post(urlResolve(environment.apiUrl, 'shoppinglist'), item);

  }

  remove(id: string) {

    // Workaround to make angular send data with a delete request
    // https://stackoverflow.com/questions/38819336/body-of-http-delete-request-in-angular2
    return this._http.request('DELETE', urlResolve(environment.apiUrl, 'shoppinglist'), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: { id: id }
    });

    // return this._http.delete(urlResolve(environment.apiUrl, 'shoppinglist'), item);

  }

  search(q: string) {

    const u = new URL(urlResolve(environment.apiUrl, 'bcds/search'));
    u.searchParams.append('q', q);
    console.log(u.href);

    return this._http.get<Bcds[]>(u.href);

  }

}
