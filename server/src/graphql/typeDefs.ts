import { gql } from "apollo-server-express";

export const typeDefs = gql`
    type Listing {
        id: ID!,
        title: String!,
        image: String!,
        address: String!,
        price: Int!,
        numOfGuests:Int!,
        numOfBeds: Int!,
        numOfBaths: Int!,
        rating: Int!,
        favored: Boolean!,
        bookings: [String]
    }

    type Booking {
        id: ID!,
        title: String!,
        image: String!,
        address: String!,
        timestamp: String!
    }


    type Query {
        listings: [Listing!]!,
        bookings: [Booking!]
    }

    type Mutation {
        deleteListing(id: ID!): Listing!,
        createBooking(id:ID!, timestamp:String!): Booking,
        favoriteListing(id:ID!): Listing!
    }

`;
