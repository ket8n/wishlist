import { createWish, getUsersWishes } from "@/actions/wish";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  console.log(session);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const newWish = await createWish(body);

  return NextResponse.json({
    message: "Wish created successfully.",
    wish: newWish,
  });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const wishes = await getUsersWishes(session.user.id);
  return NextResponse.json(wishes);
}
