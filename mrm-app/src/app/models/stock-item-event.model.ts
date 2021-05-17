export class StockItemEvent {
    constructor(
        public id : number,
        public stockItemId : number = null,
        public status : string = null,
        public comment : string = null
    ) {

    }
}
