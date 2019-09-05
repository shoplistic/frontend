import { Component, OnInit } from '@angular/core';
import { IcaApiService } from '../_services/ica-api.service';

@Component({
  selector: 'app-dev',
  templateUrl: './dev.component.html',
  styleUrls: ['./dev.component.scss']
})
export class DevComponent implements OnInit {

  constructor(private _ica: IcaApiService) { }

  ngOnInit() {
  }

  handleClick() {
    this._ica.barcodeLookup('7313350007203').subscribe(
      res => {
        console.log(res);
      },
      _err => {
        console.log(_err);
      }
    );
  }

}
