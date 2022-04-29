import IProductInstance from "./IProductInstance";

export default interface ICart {
    id: number;
    userId: number;
    date: string;
    products: IProductInstance[];
}