import  {Collection, ObjectId} from "mongodb";


export interface Listing {
    _id: ObjectId,
    title:string,
    image: string,
    address:string,
    price: number,
    numOfGuests:number,
    numOfBeds:number,
    numOfBaths: number,
    rating:number;
    favored: boolean,
    bookings: [string]
}

export interface Booking {
    _id: ObjectId,
    title: String,
    image: string,
    address: string,
    timestamp:string
}


export interface Database {
     listings: Collection<Listing>,
     bookings: Collection<Booking>,

}