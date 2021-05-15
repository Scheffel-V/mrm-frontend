import { Supplier } from "./supplier.model"

export class StockItem {
    constructor(
        public id : number,
        public code : string = "",
        public name : string = "",
        public type : string = "",
        public power : string = "",
        public brand : string = "",
        public model : string = "",
        public rentValue : any = null,
        public replacementCost : number = null,
        public numberOfUses : number = null,
        public lastMaintenance : Date = null,
        public acquisitionDate : Date = null,
        public needsMaintenance : boolean = false,
        public imageURL : string = "",
        public status : string = "INVENTORY",
        public supplierId : number = null,
        public supplier : Supplier = new Supplier(-1),
        public statusComment : string = "",
        public comment : string = "",
        public active : boolean = true,
    ) {

    }
}
