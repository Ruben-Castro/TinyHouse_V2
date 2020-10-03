import { gql } from "apollo-server-express";

export const typeDefs = gql`

type Viewer {
  id: ID
  token: String
  avatar:String
  hasWallet:Boolean
  didRequest:Boolean!
}

type Bookings {
  total: Int!
  result: [Booking!]!
}
type Listings {
  total: Int!
  result:[Listing!]!
}

type Booking {
  id:ID!
  listing: Listing!
  tenant: User!
  checkIn: String!
  checkOut:String!

}

type Listing {
  id: ID!
  title:String
  description:String
  image:String!
  host:User!
  type: ListingType!
  address:String!
  city:String!
  bookings(limit: Int!, page:Int!): Bookings
  bookingsIndex:String! 
  price: Int!
  numOfGuests:Int!

}

enum ListingType {
  APARTMENT
  HOUSE
}

type User {
  id: ID
  name: String!
  avatar: String!
  contact:String!
  hasWallet:Boolean!
  income:Int
  bookings(limit:Int!, page: Int!):Bookings
  listings(limit:Int!, page: Int!):Listings!
}

input LogInInput {
    code:String!
  }

  type Query {
    authUrl: String!
    user(id:ID!): String!
  }

 

  type Mutation {
    logIn(input:LogInInput): Viewer!
    logOut: Viewer!
  }
`;
