export interface IShoppingListItem {
  _id?: string;
  barcode: string;
  display_name: string;
  manufacturer: string;
  amount: number;
}

export class ShoppingListItem {

  constructor(
    public barcode: string,
    public display_name: string,
    public manufacturer: string,
    public amount: number
  ) { }

}
