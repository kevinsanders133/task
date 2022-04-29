import IGeolocation from "./IGeolocation";

export default interface IAddress {
    geolocation: IGeolocation;
    city: string;
    street: string;
    number: string;
    zipcode: string;
}