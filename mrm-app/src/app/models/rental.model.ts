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
        public durationMode : string = "CUSTOM",
        public startDate : Date = new Date(),
        public endDate : Date = null,
        public period : number = null,
        public approvalDate : Date = null,
        public additivesEndDate : Date = null,
        public paymentDueDate : Date = null,
        public paymentType : string = null,
        public paidAt : Date = null,
        public invoiceNumber : number = null,
        public invoiceStatus : string = "PENDING",
        public contractNumber : number = null,
        public value : any = 0,
        public status : string = "APPROVED",
        public invoiceUrl : string = null,
        public contractUrl : string = null,
        public deliveryMode : string = "PICKUP",
        public deliveryCost : any = 0,
        public paymentComment : string = null,
        public workingHours : string = "8H",
        public installments : string = "1",
        public comment : string = null,
        public invoiceComment : string = "",
        public purchaseOrderNumber : string = null,
        public active : boolean = true,
        public invoicedAt : Date = null,
        public laborAndDisplacementPrice : any = 0,
        public addressToDeliver : string = ""
    ) {

    }
}
