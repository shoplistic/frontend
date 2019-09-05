import { Component, OnInit } from '@angular/core';
import { StatsService } from '../_services/stats.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private _stats: StatsService) { }

  version: string | null = null;
  year = new Date().getFullYear();

  ngOnInit() {
    this._stats.version().subscribe(
      res => {
        this.version = res.version;
      },
      _err => {
        this.version = 'Error fetching version';
      }
    );
  }

}
