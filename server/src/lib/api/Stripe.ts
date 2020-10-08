import stripe from "stripe";

const client = new stripe(`${process.env.S_SECRET_KEY}`, {apiVersion: "2020-08-27"});

export const Stripe = {
  connect: async (code: string) => {
    const response = await client.oauth.token({
      /* eslint-disable @typescript-eslint/camelcase */
      grant_type: "authorization_code",
      code,
      /* eslint-enable @typescript-eslint/camelcase */
    });

    if (!response) {
       throw new Error("Failed to connect with Stripe");
    }

    return response;
  },
};
