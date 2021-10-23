import { StockItem } from "./stock-item.model";


export class StockItemEvent {
    constructor(
        public id : number,
        public stockItemId : number = null,
        public status : string = null,
        public comment : string = null,
        public stockItem : StockItem,
        public createdAt : Date,
        public textToDisplay : string = ""
    ) {

    }
}
