import { Address } from "./address.model";

export class Supplier {
    constructor(
        public id : number,
        public companyName : string = "",
        public commercialName : string = "",
        public cpf : string = "",
        public cnpj : string = "",
        public address : Address = new Address(),
        public mobilePhone : string = "",
        public email : string = "",
        public active : boolean = true,
        public comment : string = ""
    ) {

    }
}
