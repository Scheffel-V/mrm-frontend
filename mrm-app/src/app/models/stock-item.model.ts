import { ProductModel } from "./product-model.model";
import { Supplier } from "./supplier.model"

export class StockItem {
    constructor(
        public id : number,
        public productModelId : number,
        public productModel : ProductModel,
        public supplier : Supplier = new Supplier(-1),
        public status : string = "INVENTORY",
        public comment : string = "",
        public active : boolean = true,
    ) {

    }
}
