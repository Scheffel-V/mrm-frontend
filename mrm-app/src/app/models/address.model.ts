export class Address {
    constructor(
        public id : number = -1,
        public CustomerId : number = -1,
        public SupplierId : number = -1,
        public cep : string = "",
        public city : string = "",
        public number : string = "",
        public street : string = "",
        public neighborhood : string = "",
        public complement : string = "",
        public createdAt : Date = new Date(),
        public updatedAt : Date = new Date()
    ) {
        
    }
}