import { IResolvers } from "apollo-server-express";

export const viewerResolvers: IResolvers = {
  Query: {
    authUrl: () => {
      return "Query.authUrl";
    },
  },

  Mutation: {
    logIn: () => {
      return "Mutation.LogIn";
    },
  },
};