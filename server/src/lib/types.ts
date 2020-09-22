import  {Collection, ObjectId} from "mongodb";


export interface Listing {
    _id: ObjectId,
}

export interface Booking {
    _id: ObjectId,
  
}


export interface Database {
     listings: Collection<Listing>,
     bookings: Collection<Booking>,
     users: Collection<User>

}


export interface User {
    _id: ObjectId;
}

