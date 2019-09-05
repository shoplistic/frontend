import { Component, OnInit } from '@angular/core';
import { StatsService, Stats } from '../_services/stats.service';
import { InfoBarService } from '../_services/info-bar.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  version: string;
  stats: Stats = new Stats(0, 0, 0);
  uptime: string;

  constructor(private _stats: StatsService, private _infoBarService: InfoBarService) { }

  ngOnInit() {

    this._stats.version().subscribe(
      res => {
        this.version = res.version;
      },
      _err => {
        this._infoBarService.show('Error fetching version', 3e3);
      }
    );

    this._stats.stats().subscribe(
      res => {
        this.stats = res;
        this.uptime = ((r) => {
          const d = Math.floor(r.uptime / (3600 * 24));
          const h = Math.floor((r.uptime / 3600) % 24);
          const m = Math.floor((r.uptime / 60) % 60);
          const s = r.uptime % 60;
          return `${d} days, ${h} hours, ${m} minutes, ${s} seconds`;
        })(res);
      },
      _err => {
        this._infoBarService.show('Error fetching stats', 3e3);
      }
    );

  }

}
