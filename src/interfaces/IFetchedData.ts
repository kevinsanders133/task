import IUser from "./IUser";
import ICart from "./ICart";
import IProduct from "./IProduct";

export default interface IFetchedData {
    users: IUser[];
    carts: ICart[];
    products: IProduct[];
}