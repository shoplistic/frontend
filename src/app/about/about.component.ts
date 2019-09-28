import { Component, OnInit } from '@angular/core';
import { StatsService } from '../_services/stats.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private _stats: StatsService) { }

  appVersion: string | null = null;
  serverVersion: string | null = null;
  year = new Date().getFullYear();

  ngOnInit() {
    this._stats.version().subscribe(
      res => {
        this.appVersion = res.frontend.version;
        this.serverVersion = res.backend.version;
      },
      _err => {
        this.appVersion = 'Error fetching version.';
        this.serverVersion = 'Error fetching version.';
      }
    );
  }

}
