import { Customer } from "./customer.model";
import { StockItem } from "./stock-item.model"

export class Rental {
    constructor(
        public id : number,
        public customer : Customer,
        public stockItems : StockItem[],
        public startDate : Date = null,
        public endDate : Date = null,
        public fiscalNote : string = "",
        public totalValue : number = null,
        public status : string = "Opened",
        public approvedDate : Date = null,
        public leaveDate : Date = null,
        public arriveDate : Date = null,
        public active : boolean = true
    ) {

    }
}
