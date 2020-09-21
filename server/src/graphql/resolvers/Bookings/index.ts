import { IResolvers } from "apollo-server-express";

import { Database, Booking } from "../../../lib/types";
import { ObjectId } from "mongodb";

export const bookingResolvers: IResolvers = {
  Booking: {
    id: (booking: Booking): String => booking._id.toString(),
  },

  Query: {
    bookings: async (
      _root: undefined,
      _args: {},
      { db }: { db: Database }
    ): Promise<Booking[]> => {
      return await db.bookings.find({}).toArray();
    },
  },

  Mutation: {
    createBooking: async (
      _root: undefined,
      { id, timestamp }: { id: string; timestamp: string },
      { db }: { db: Database }
    ): Promise<Booking> => {
      const listing = await db.listings.findOne({
        _id: new ObjectId(id),
      });

      if (!listing) {
        throw new Error("listing can't be found");
      }

      const insertRes = await db.bookings.insertOne({
        _id: new ObjectId(),
        title: listing.title,
        image: listing.image,
        address: listing.address,
        timestamp: Date().toLocaleString(),
      });

      const insertedBooking: Booking = insertRes.ops[0];

      if (!insertedBooking) {
        throw new Error("failed to create booking");
      }

      await db.listings.updateOne(
        { _id: listing._id },
        { $push: { bookings: insertedBooking._id.toString() } }
      );

      return insertedBooking;
    },
  },
};
