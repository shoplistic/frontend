import { Component, ViewChild, ElementRef, DoCheck } from '@angular/core';
import { InfoBarService } from '../_services/info-bar.service';

@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.scss']
})
export class InfoBarComponent implements DoCheck {

  @ViewChild('ib', { static: true }) ib: ElementRef;

  timeout: number;

  constructor(private _infobarService: InfoBarService) { }

  ngDoCheck() {

    if (this._infobarService.visible) {

      this.show(this._infobarService.text, this._infobarService.ms);

    }

  }

  show(text: string, ms: number) {

    this.ib.nativeElement.innerText = text;
    this.ib.nativeElement.classList.add('show');

    if (ms) {
      clearTimeout(this.timeout);
      this.timeout = window.setTimeout(() => {
        this.hide();
      }, ms);
    }

  }

  hide() {

    this.ib.nativeElement.classList.remove('show');
    this._infobarService.visible = false;

  }

}
