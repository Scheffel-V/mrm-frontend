import { Address } from "./address.model";

export class Customer {
    constructor(
        public id : number,
        public companyName : string = "",
        public commercialName : string = "",
        public cpf : string = "",
        public cnpj : string = "",
        public address : Address = new Address(),
        public phoneNumber : string = "",
        public mobilePhoneNumber : string = "",
        public email : string = "",
        public active : boolean = true
    ) {
        
    }
}