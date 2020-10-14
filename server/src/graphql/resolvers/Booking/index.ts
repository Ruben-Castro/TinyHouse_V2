import { IResolvers } from "apollo-server-express";
import { Booking, Database, Listing, BookingsIndex } from "../../../lib/types";
import { CreateBookingArgs } from "./types";
import { Request } from "express";
import { authorize } from "../../../lib/utils";
import { ObjectId } from "mongodb";
import { Stripe } from "../../../lib/api";

const resolveBookingsIndex = (
  bookingsIndex: BookingsIndex,
  checkInDate: string,
  checkOutDate: string
): BookingsIndex => {
  let dateCursor = new Date(checkInDate);
  let checkOut = new Date(checkOutDate);
  const newBookingsIndex: BookingsIndex = { ...bookingsIndex };

  while (dateCursor <= checkOut) {
    const y = dateCursor.getUTCFullYear();
    const m = dateCursor.getUTCMonth();
    const d = dateCursor.getUTCDate();

    if (!newBookingsIndex[y]) {
      newBookingsIndex[y] = {};
    }

    if (!newBookingsIndex[y][m]) {
      newBookingsIndex[y][m] = {};
    }

    if (!newBookingsIndex[y][m][d]) {
      newBookingsIndex[y][m][d] = true;
    } else {
      throw new Error(
        "selected dates can;t overlap dates that have already been booked"
      );
    }

    dateCursor = new Date(dateCursor.getTime() + 86400000);
  }

  return newBookingsIndex;
};

export const bookingResolvers: IResolvers = {
  Mutation: {
    createBooking: async (
      _root: undefined,
      { input }: CreateBookingArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Booking> => {
      try {
        const { id, source, checkIn, checkOut } = input;

        //verify a logged in user is making the request
        const viewer = await authorize(db, req);
        if (!viewer) {
          throw new Error("viewer can't be found");
        }

        //find lisitng document that is being booked
        const listing = await db.listings.findOne({
          _id: new ObjectId(),
        });

        if (!listing) {
          throw new Error("Listing can't be found");
        }
        //check that viewer is Not booking their own listing
        if (listing.host === viewer._id) {
          throw new Error("viewer can't book own listing");
        }

        //check  that checkOut is not before checkIn
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkOutDate < checkInDate) {
          throw new Error("check out date can't be before check in date");
        }

        //create a new bookingsIndex for listing being booked
        const bookingIndex = resolveBookingsIndex(
          listing.bookingsIndex,
          checkIn,
          checkOut
        );

        //get total price to charge
        const totalPrice =
          listing.price *
          ((checkOutDate.getTime() - checkInDate.getTime()) / 86400000 + 1);

        //get user document of host of listing
        const host = await db.users.findOne({
          _id: listing.host,
        });

        if (!host || !host.walletId) {
          throw new Error(
            "the host either can't be found or is not connected with Stripe"
          );
        }

        //create Stripe charge on behalf of host
        await Stripe.charge(totalPrice, source, host.walletId);

        //insert new booking document to bookings collection
        const insertRes = await db.bookings.insertOne({
          _id: new ObjectId(),
          listing: listing._id,
          tenant: viewer._id,
          checkIn,
          checkOut,
        });

        //update user document of host to increment income
        const insertedBooking: Booking = insertRes.ops[0];

        await db.users.updateOne(
          {
            _id: host._id,
          },
          {
            $inc: { income: totalPrice },
          }
        );
        //updat bookings filed of tenant
        await db.users.updateOne(
          {
            _id: viewer._id,
          },
          {
            $push: { bookings: insertedBooking._id },
          }
        );

        //update bookings field of listing document
        await db.listings.updateOne(
          {
            _id: listing._id,
          },
          {
            $set: { bookingIndex },
            $push: { bookings: insertedBooking._id },
          }
        );

        //return the newly inserted booking
        return insertedBooking;
      } catch (error) {
        throw new Error(`Failed to create a booking ${error}`);
      }
    },
  },
  Booking: {
    id: (booking: Booking): string => {
      return booking._id.toString();
    },
    listing: (
      booking: Booking,
      _args: {},
      { db }: { db: Database }
    ): Promise<Listing | null> => {
      return db.listings.findOne({ _id: booking.listing });
    },
    tenant: (booking: Booking, _args: {}, { db }: { db: Database })=> {
      return db.users.findOne({
        _id: booking.tenant,
      });
    },
  },
};
