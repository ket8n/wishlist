import { deleteWish, getWishById, updateWish } from "@/actions/wish";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const wish = await getWishById(id);

  if (!wish)
    return NextResponse.json({ message: "Wish not found!" }, { status: 404 });

  return NextResponse.json(wish);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deletedWish = await deleteWish(id);

  return NextResponse.json({
    message: "Wish deleted successfully!",
    wish: deletedWish,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const updatedWish = await updateWish(id, body);

  return NextResponse.json({
    message: "Wish updated successfully!",
    wish: updatedWish,
  });
}
