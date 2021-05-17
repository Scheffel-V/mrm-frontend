export class Additive {
    constructor(
        public id : number,
        public rentContractId : number = null,
        public startDate : Date = null,
        public endDate : Date = null,
        public approvalDate : Date = null,
        public paymentDueDate : Date = null,
        public paidAt : Date = null,
        public contractNumber : number = null,
        public contractUrl : string = null,
        public invoiceNumber : number = null,
        public paymentType : string = null,
        public paymentComment : string = null,
        public period : number = null,
        public invoiceStatus : string = "PENDING",
        public invoiceUrl : string = null,
        public value : any = null,
        public installments : any = "1",
        public status : string = "Opened",
        public comment : string = "",
    ) {

    }
}
