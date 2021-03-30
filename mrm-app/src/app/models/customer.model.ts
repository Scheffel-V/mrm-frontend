export class Customer {
    constructor(
        public id : number,
        public companyName : string = "",
        public commercialName : string = "",
        public cpf : string = "",
        public cnpj : string = "",
        public address : string = "",
        public number : string = "",
        public city : string = "",
        public phoneNumber : string = "",
        public mobilePhoneNumber : string = "",
        public email : string = "",
        public active : boolean = false
    ) {
        
    }
}