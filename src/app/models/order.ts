import { QuantityProduct } from "./quantitryProduct";
import { User } from "./user";

export class Order{
    _id?:string;
    user:User;
    products:QuantityProduct[];
    adress?:string;
}