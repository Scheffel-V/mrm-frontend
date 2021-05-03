export class ProductModel {
    constructor(
        public id : number,
        public name : string = "",
        public type : string = "",
        public power : string = "",
        public brand : string = "",
        public model : string = "",
        public standardRentalValue : number = null,
        public repositionValue : number = null,
        public image : string = ""
    ) {

    }
}
