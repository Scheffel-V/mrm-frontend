import { Customer } from "./customer.model";
import { ItemRental } from "./item-rental.model"
import { Additive } from "./additive.model";

export class Rental {
    constructor(
        public id : number,
        public customer : Customer,
        public customerId : number = null,
        public itemRentals : ItemRental[],
        public additives : Additive[],
        public durationMode : string = "",
        public startDate : Date = new Date(),
        public endDate : Date = null,
        public period : number = null,
        public approvalDate : Date = null,
        public paymentDueDate : Date = null,
        public paidAt : Date = null,
        public fiscalNote : string = "",
        public value : number = null,
        public status : string = "Opened",
        public active : boolean = true
    ) {

    }
}
