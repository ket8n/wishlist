import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginCard } from "@/components/auth/login-card";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sign in · Wishlist" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (await getCurrentUser()) redirect("/dashboard");

  const { error } = await searchParams;
  return <LoginCard error={typeof error === "string" ? error : undefined} />;
}
