import IAddress from "./IAddress";
import IName from "./IName";

export default interface IUser {
    address: IAddress;
    id: number;
    email: string;
    username: string;
    password: string;
    name: IName;
    phone: string;
}