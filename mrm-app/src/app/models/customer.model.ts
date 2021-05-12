import { Address } from "./address.model";

export class Customer {
    constructor(
        public id : number,
        public name : string = "",
        public commercialName : string = "",
        public cnpj : string = "",
        public address : Address = new Address(),
        public mobilePhone : string = "",
        public email : string = "",
        public active : boolean = true,
        public comment : string = ""
    ) {
        
    }
}