import IUser from "./interfaces/IUser";
import ICart from "./interfaces/ICart";
import IProduct from "./interfaces/IProduct";
import IFetchedData from "./interfaces/IFetchedData";
import IProductStats from "./interfaces/IProductStats";
import IProductInstance from "./interfaces/IProductInstance";
import ITransformedArray from "./interfaces/ITransformedArray";
import axios, { AxiosResponse } from "axios";

const USERS_URL: string = 'https://fakestoreapi.com/users';
const CARTS_URL: string = 'https://fakestoreapi.com/carts';
const PRODUCTS_URL: string = 'https://fakestoreapi.com/products';

const fetchData = async (): Promise<IFetchedData | null> => {

    try {
        const usersRes: AxiosResponse<IUser[]> = await axios.get(USERS_URL);
        const cartsRes: AxiosResponse<ICart[]> = await axios.get(CARTS_URL);
        const productsRes: AxiosResponse<IProduct[]> = await axios.get(PRODUCTS_URL);

        const users: IUser[] = usersRes.data;
        const carts: ICart[] = cartsRes.data;
        const products: IProduct[] = productsRes.data;

        const result: IFetchedData = { users, carts, products };

        return result;
    }
    catch(e) {
        console.log(e);
    }
    return null;
}

const createProductStats = (products: IProduct[]): IProductStats => {

    let result: IProductStats = {};

    products.forEach(product => {
        if (result.hasOwnProperty(product.category)) {
            result[product.category] += 1;
            return;
        }
        result[product.category] = 1;
    });

    return result;
}

const convertArrayToObject = <T extends {id: number}>(array: Array<T>): ITransformedArray<T> => {

    let result: ITransformedArray<T> = {};

    array.forEach(element => {
        result[element.id] = element;
    });

    return result;
}

const findTheMostExpensiveCart = (
        users: ITransformedArray<IUser>,
        carts: ICart[],
        products: ITransformedArray<IProduct>): {cart: ICart, theBiggestPrice: number, ownerName: string} => {

    let cart: ICart = carts[0];
    let theBiggestPrice: number = 0;
    let ownerName: string;

    for (let i = 0; i < carts.length; i++) {

        const productInstances: IProductInstance[] = carts[i].products;

        let cartPrice = 0;

        for (let j = 0; j < productInstances.length; j++) {
            const productId = productInstances[j].productId;

            cartPrice += products[productId].price * productInstances[j].quantity;
        }

        if (cartPrice > theBiggestPrice) {
            theBiggestPrice = cartPrice;
            cart = carts[i];
        }
    }

    const user: IUser = users[cart.userId];
    
    ownerName = `${user.name.firstname} ${user.name.lastname}`;

    return { cart, theBiggestPrice, ownerName };
}

const findTheLongestDistance = (users: IUser[]): { user1: IUser, user2: IUser, distance: number } => {

    const usersInds = { id1: -1, id2: -1 };
    let theLongestDistance = -1;

    for (let i = 0; i < users.length - 1; i++) {

        for (let j = i + 1; j < users.length; j++) {
            const geo1 = users[i].address.geolocation;
            const geo2 = users[j].address.geolocation;

            const lon1 = Number(geo1.long);
            const lon2 = Number(geo2.long);
            const lat1 = Number(geo1.lat);
            const lat2 = Number(geo2.lat);

            const distance = calculateDistance(lon1, lon2, lat1, lat2);

            if (distance > theLongestDistance) {
                theLongestDistance = distance;
                usersInds.id1 = i;
                usersInds.id2 = j;
            }
        }
    }

    const result = {
        user1: users[usersInds.id1],
        user2: users[usersInds.id2],
        distance: theLongestDistance,
    }

    return result;
}

const calculateDistance = (lon1: number, lon2: number, lat1: number, lat2: number) => {

    const earthRadiusKm = 6371;

    lon1 = Number(lon1) * Math.PI / 180;
    lon2 = Number(lon2) * Math.PI / 180;
    lat1 = Number(lat1) * Math.PI / 180;
    lat2 = Number(lat2) * Math.PI / 180;

    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;

    const a = Math.pow(Math.sin(dlat / 2), 2)
            + Math.cos(lat1) * Math.cos(lat2)
            * Math.pow(Math.sin(dlon / 2), 2);

    const c = 2 * Math.asin(Math.sqrt(a));

    const result = c * earthRadiusKm;

    return result;
}

const main = async () => {

    // Task 1
    const data: IFetchedData = await fetchData() as IFetchedData;

    console.log();

    // Task 2
    const productStats = createProductStats(data.products);

    for (const key in productStats) {
        console.log(`Categoty: "${key}", quantity: ${productStats[key]}.`);
    }

    console.log();

    // Task 3
    // I convert users and products to objects for faster search (O(1) time complexity)
    const users: ITransformedArray<IUser> = convertArrayToObject(data.users);
    const carts: ICart[] = data.carts;
    const products: ITransformedArray<IProduct> = convertArrayToObject(data.products);

    const { cart, theBiggestPrice, ownerName } = findTheMostExpensiveCart(users, carts, products);

    console.log(`The most expensive cart: id - ${cart.id}, price - ${theBiggestPrice}, owner - ${ownerName}.`);

    console.log();

    // Task 4
    const { user1, user2, distance } = findTheLongestDistance(data.users);

    console.log('Two users living furthest away from each other are:');
    console.log(`id: ${user1.id}, name: ${user1.name.firstname} ${user1.name.lastname},`);
    console.log(`id: ${user2.id}, name: ${user2.name.firstname} ${user2.name.lastname}.`);
    console.log(`Distance = ${distance} km.`);

    console.log();
}

main();