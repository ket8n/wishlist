"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function googleAuthentiate() {
  try {
    await signIn("google");
  } catch (err) {
    if (err instanceof AuthError) {
      return "Failed to log in using Google Account.";
    }
    throw err;
  }
}
