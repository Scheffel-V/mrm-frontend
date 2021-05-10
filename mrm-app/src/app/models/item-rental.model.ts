import { StockItem } from "./stock-item.model";

export class ItemRental {
    constructor(
        public id : number,
        public leftAt : Date = null,
        public ReturnedAt : Date = null,
        public value : number = null,
        public stockItem : StockItem = null,
        public stockItemId : number = null,
        public rentContractId : number = null,
        public comment : string = ""
    ) {

    }
}
