import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ShoppingListItem } from '../_classes/shopping-list-item';
import { ShoppingListService } from '../_services/shopping-list.service';
import { InfoBarService } from '../_services/info-bar.service';
import { Bcds } from '../_classes/bcds';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements AfterViewInit {

  @ViewChild('af', { static: true }) af: ElementRef;

  item = new ShoppingListItem('', '', '', 1);
  datalist: Bcds[] = [];

  constructor(private _shoppinlistService: ShoppingListService, private _infobarService: InfoBarService) { }

  ngAfterViewInit() {
    this.af.nativeElement.focus();
  }

  onSubmit() {
    this._shoppinlistService.add(this.item).subscribe(
      _res => {
        this._infobarService.show(`${this.item.display_name} added to the shopping list`, 3000);
        this.item = new ShoppingListItem('', '', '', 1);
      },
      _err => {
        // console.error(err);
        this._infobarService.show(`Error adding ${this.item.display_name}`, 3000);
      }
    );
  }

  search() {
    if ((this.item.display_name.length % 2 === 0 || this.item.display_name.length === 1) && this.item.display_name.length > 0) {
      this._shoppinlistService.search(this.item.display_name.trim()).subscribe(
        res => {
          this.datalist = res;
        },
        _err => {
          this.datalist = [];
        }
      );
    }
  }

  fill() {
    for (const item of this.datalist) {

      if (item.display_name === this.item.display_name) {
        this.item = new ShoppingListItem(item.barcode, item.display_name, item.manufacturer, 1);
        this.datalist = [];
        break;
      }

    }

  }

}
