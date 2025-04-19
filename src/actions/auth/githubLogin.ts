"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function githubAuthentiate() {
  try {
    await signIn("github");
  } catch (err) {
    if (err instanceof AuthError) {
      return "Failed to log in using Github Account.";
    }
    throw err;
  }
}
