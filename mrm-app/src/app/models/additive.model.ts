export class Additive {
    constructor(
        public id : number,
        public rentContractId : number = null,
        public startDate : Date = null,
        public endDate : Date = null,
        public approvalDate : Date = null,
        public paymentDueDate : Date = null,
        public paidAt : Date = null,
        public invoiceNumber : string = null,
        public value : number = null,
        public status : string = "Opened",
        public comment : string = "",
        public active : boolean = true
    ) {

    }
}
