import { IResolvers } from "apollo-server-express";
import { Viewer, Database, User } from "../../../lib/types";
import { Google } from "../../../lib/api";
import { LogInArgs } from "./types";
import crypto from "crypto";

const logInViaGoogle = async (
  code: string,
  token: string,
  db: Database
): Promise<User | undefined> => {
  const { user } = await Google.logIn(code);

  if (!user) {
    throw new Error("Google Login Error");
  }

  //Name photo and email
  const userNameList = user.names && user.names.length ? user.names : null;
  const userPhotoList = user.photos && user.photos.length ? user.photos : null;
  const userEmailList =
    user.emailAddresses && user.emailAddresses.length
      ? user.emailAddresses
      : null;

  // user Display name
  const userName =
    userNameList && userNameList[0].displayName
      ? userNameList[0].displayName
      : null;

  //
  const metadata =
    userNameList && userNameList[0].metadata ? userNameList[0].metadata : null;

  //const userID
  const userId = metadata && metadata.source ? metadata.source.id : null;
  //user avatar
  const userAvatar =
    userPhotoList && userPhotoList[0].url ? userPhotoList[0].url : null;

  //user email
  const userEmail =
    userEmailList && userEmailList[0].value ? userEmailList[0].value : null;

  if (!userId || !userName || !userAvatar || !userEmail) {
    throw new Error("Google log in Failed");
  }

  // check if user is in the database
  const updateRes = await db.users.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        name: userName,
        avatar: userAvatar,
        contact: userEmail,
        token,
      },
    },
    { returnOriginal: false }
  );

  let viewer = updateRes.value;

  if (!viewer) {
    const insertResult = await db.users.insertOne({
      _id: userId,
      token,
      name: userName,
      avatar: userAvatar,
      contact: userEmail,
      income: 0,
      bookings: [],
      listings: [],
    });

    viewer = insertResult.ops[0];
  }

  return viewer;
};

export const viewerResolvers: IResolvers = {
  Query: {
    authUrl: (): string => {
      try {
        return Google.authUrl;
      } catch (error) {
        throw new Error(`Failed to query Googl Auth Url: ${error}`);
      }
    },
  },

  Mutation: {
    logIn: async (
      _root: undefined,
      { input }: LogInArgs,
      { db }: { db: Database }
    ) => {
      try {
        const code = input ? input.code : null;
        const token = crypto.randomBytes(16).toString("hex");

        const viewer: User | undefined = code
          ? await logInViaGoogle(code, token, db)
          : undefined;

        if (!viewer) {
          return { didRequest: true };
        }

        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(`Failed to log in: ${error}`);
      }
    },

    logOut: () => {
      try {
        return { didRequest: true };
      } catch (error) {
        throw new Error(`Failed to log out ${error}`);
      }
    },
  },

  Viewer: {
    id: (viewer: Viewer) => {
      return viewer._id;
    },

    hasWallet: (viewer: Viewer): boolean | undefined => {
      return viewer.walletId ? true : undefined;
    },
  },
};
