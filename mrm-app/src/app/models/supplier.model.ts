import { Address } from "./address.model";
import { StockItem } from "./stock-item.model"

export class Supplier {
    constructor(
        public id : number,
        public name : string = "",
        public commercialName : string = "",
        public cnpj : string = "",
        public address : Address = new Address(),
        public mobilePhone : string = "",
        public email : string = "",
        public active : boolean = true,
        public comment : string = "",
        public stockItems : StockItem[] = []
    ) {

    }
}
