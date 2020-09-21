import { ObjectId } from "mongodb";
import { IResolvers } from "apollo-server-express";
import { Database, Listing } from "../../../lib/types";

export const listingResolvers: IResolvers = {
  Listing: {
    id: (listing: Listing): String => listing._id.toString(),
  },

  Query: {
    listings: async (
      _root: undefined,
      _args: {},
      { db }: { db: Database }
    ): Promise<Listing[]> => {
      return await db.listings.find({}).toArray();
    },
  },

  Mutation: {
    deleteListing: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing> => {
      const deleteRes = await db.listings.findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (!deleteRes.value) {
        throw new Error("failed to delete listing");
      }

      return deleteRes.value;
    },

    favoriteListing: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing> => {
      // find the listing
      const listing = await db.listings.findOne({ _id: new ObjectId(id) });

      if (!listing) {
        throw new Error("failed to retrieve listing");
      }

      //update listings
      const updateRes = await db.listings.findOneAndUpdate(
        { _id: new ObjectId(id) },

        { $set: { favored: !listing.favored } },
        { returnOriginal: false }
      );

      if (!updateRes.value) {
        throw new Error("failed to update listing");
      }
      //return the updated listing
      return updateRes.value;
    },
  },
};
