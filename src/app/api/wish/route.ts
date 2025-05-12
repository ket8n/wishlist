import { createWish, getUsersWishes } from "@/actions/wish";
import { auth } from "@/auth";
import { CreateWishSchema } from "@/lib/wishValidations";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    console.log(session);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const parsed = CreateWishSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const newWish = await createWish({
      ...parsed.data,
      userId: session.user.id,
    });

    return NextResponse.json(
      {
        message: "Wish created successfully.",
        wish: newWish,
      },
      { status: 201 }
    );
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

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const wishes = await getUsersWishes(session.user.id);
    return NextResponse.json(wishes);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Unknown error occured!" },
      { status: 500 }
    );
  }
}
