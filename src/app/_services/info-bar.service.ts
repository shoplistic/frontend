import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InfoBarService {

  constructor() { }

  text = '';
  ms = 0;
  visible = false;

  show(text: string, ms = 0) {

    this.text = text;
    this.ms = ms;
    this.visible = true;

  }

  hide() {

    this.visible = false;

  }

}
