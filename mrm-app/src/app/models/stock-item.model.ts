import { ProductModel } from "./product-model.model";

export class StockItem {
    constructor(
        public id : number,
        public productModelId : number,
        public productModel : ProductModel,
        public status : string = "INVENTORY",
        public comment : string = "",
    ) {

    }
}
