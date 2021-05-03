export class StockItem {
    constructor(
        public id : number,
        public productModelId : number,
        public status : string = "INVENTORY",
        public comment : string = ""
    ) {

    }
}
