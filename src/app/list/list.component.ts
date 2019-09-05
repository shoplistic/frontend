import { Component, OnInit } from '@angular/core';
import { IShoppingListItem } from '../_classes/shopping-list-item';
import { ShoppingListService } from '../_services/shopping-list.service';
import { InfoBarService } from '../_services/info-bar.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  shoppingList: IShoppingListItem[] = [];
  error = false;

  constructor(private _shoppinglistService: ShoppingListService, private _infobarService: InfoBarService) { }

  ngOnInit() {
    this.fetchItems();
  }

  fetchItems(showInfoBar = false) {
    this._shoppinglistService.getList().subscribe(
      res => {
        this.shoppingList = res;
        this.error = false;
        if (showInfoBar) {
          this._infobarService.show('Shopping list refreshed', 3000);
        }
      },
      _err => {
        // console.error(_err);
        this.error = true;
      }
    );
  }

  removeItem(id: string) {
    this._shoppinglistService.remove(id).subscribe(
      _res => {
        for (let i = 0; i < this.shoppingList.length; i++) {
          if (this.shoppingList[i]._id === id) {
            this.shoppingList.splice(i, 1);
            break;
          }
        }
      },
      _err => {
        // console.error(err);
        this._infobarService.show('Error removing item', 3000);
      }
    );
  }

}
