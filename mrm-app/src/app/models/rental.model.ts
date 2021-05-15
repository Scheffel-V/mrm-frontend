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
        public durationMode : string = null,
        public startDate : Date = new Date(),
        public endDate : Date = null,
        public period : number = null,
        public approvalDate : Date = null,
        public paymentDueDate : Date = null,
        public paymentType : string = null,
        public paidAt : Date = null,
        public invoiceNumber : string = null,
        public contractNumber : string = null,
        public value : any = null,
        public status : string = "Approved",
        public receiptUrl : string = null,
        public contractUrl : string = null,
        public active : boolean = true,
        public comment : string = null,
    ) {

    }
}
