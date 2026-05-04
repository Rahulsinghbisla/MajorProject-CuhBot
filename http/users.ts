"use server";
import { auth } from "@/lib/auth";

export const signIn = async (email: string, password: string) => {
  await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  return {
    success: true,
    message: "Signed in successfully.",
  };
};

export const signUp = async (
  email: string,
  password: string,
  username: string,
) => {
  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name: username,
    },
  });

  return {
    success: true,
    message: "Signed up successfully.",
  };
};
