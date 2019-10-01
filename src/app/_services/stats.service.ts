import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { resolve as urlResolve } from 'url';
import { VersionResponse } from '@class/service-info';

export class Stats {

  constructor (
    public bcds_entries: number,
    public registerd_users: number,
    public uptime: number
  ) {}

}

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private _http: HttpClient) { }

  stats() {
    return this._http.get<Stats>(urlResolve(environment.apiUrl, 'admin/stats'));
  }

  version() {
    return this._http.get<VersionResponse>(urlResolve(environment.apiUrl, 'version'));
  }

}
