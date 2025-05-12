import { deleteWish, getWishById, updateWish } from "@/actions/wish";
import { auth } from "@/auth";
import { UpdateWishSchema } from "@/lib/wishValidations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const wish = await getWishById(id);

    if (!wish)
      return NextResponse.json({ message: "Wish not found!" }, { status: 404 });

    return NextResponse.json(wish);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Unknown error occured!" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Unknown error occured!" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const parsed = UpdateWishSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const updatedWish = await updateWish(id, session.user.id, parsed.data);

    return NextResponse.json({
      message: "Wish updated successfully!",
      wish: updatedWish,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      const status =
        err.message.includes("Unauthorized") ||
        err.message.includes("not found")
          ? 403
          : 500;
      return NextResponse.json({ message: err.message }, { status });
    }

    return NextResponse.json(
      { message: "Unknown error occured!" },
      { status: 500 }
    );
  }
}
