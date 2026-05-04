"use server";

import { auth } from "@/lib/auth";
import { Polar } from "@polar-sh/sdk";
import { headers } from "next/headers";

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "sandbox",
});

export async function isUserHaveSubscription() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return false;
    }

    const data = await polarClient.subscriptions.list({
      externalCustomerId: session.user.id,
      active: true,
    });

    if (data.result.items.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("erx", error);
    return false;
  }
}

export async function haveSubscription(user_id: string) {
  try {
    const data = await polarClient.subscriptions.list({
      externalCustomerId: user_id,
      active: true,
    });

    if (data.result.items.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("erx", error);
    return false;
  }
}

export async function ingestEventToPolar(
  user_id: string,
  model: string,
  input_token_usage: number,
  output_token_usage: number,
  token_usage: number,
) {
  await polarClient.events.ingest({
    events: [
      {
        name: "llm_tokens",
        externalCustomerId: user_id,
        metadata: {
          input_tokens: input_token_usage,
          output_tokens: output_token_usage,
          total_tokens: token_usage,
          model: model,
        },
      },
    ],
  });
}

export async function getCustomerMeters() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    throw new Error("user not logged in ");
  }

  const meters = await polarClient.customerMeters.list({
    externalCustomerId: session.user.id,
  });


  return meters.result.items[0];
}
