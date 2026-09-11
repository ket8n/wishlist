import { redirect } from "next/navigation";

import { LoginCard } from "@/components/auth/login-card";
import { getCurrentUser } from "@/lib/auth/session";


export default async function Home() {
  if (await getCurrentUser()) redirect("/dashboard");
  return <LoginCard />;
}
