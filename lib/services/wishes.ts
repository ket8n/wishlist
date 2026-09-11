import "server-only";

import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";
import type {
  CreateWishInput,
  WishFieldsInput,
  WishStatusValue,
} from "@/lib/validation/wish";
import { nextFulfilledOn } from "@/lib/wish-status";

// Every function takes the session user's id and scopes all queries by it.
// A wish owned by someone else behaves exactly like a missing one.

const wishInclude = {
  links: { orderBy: { position: "asc" } },
  statusChanges: { orderBy: { createdAt: "desc" }, take: 1 },
} satisfies Prisma.WishInclude;

type WishRow = Prisma.WishGetPayload<{ include: typeof wishInclude }>;

export type WishView = ReturnType<typeof toView>;

function toView(wish: WishRow) {
  const latest = wish.statusChanges[0];
  return {
    id: wish.id,
    name: wish.name,
    description: wish.description,
    images: wish.images,
    category: wish.category,
    priority: wish.priority,
    status: wish.status,
    estimatedPrice: wish.estimatedPrice?.toString() ?? null,
    currency: wish.currency,
    fulfilledOn: wish.fulfilledOn,
    createdAt: wish.createdAt,
    updatedAt: wish.updatedAt,
    links: wish.links.map(({ id, label, url }) => ({ id, label, url })),
    note: latest?.note ?? null,
    noteUpdatedAt: latest?.noteUpdatedAt ?? null,
  };
}

function linkRows(links: WishFieldsInput["links"]) {
  return links.map((link, position) => ({ ...link, position }));
}

export async function getUserWishes(userId: string) {
  const wishes = await db.wish.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: wishInclude,
  });
  return wishes.map(toView);
}

export async function getWish(userId: string, id: string) {
  const wish = await db.wish.findFirst({ where: { id, userId }, include: wishInclude });
  return wish ? toView(wish) : null;
}

export async function getWishStatusHistory(userId: string, id: string) {
  return db.wishStatusChange.findMany({
    where: { wishId: id, wish: { userId } },
    orderBy: { createdAt: "desc" },
    select: { id: true, status: true, note: true, noteUpdatedAt: true, createdAt: true },
  });
}

export async function createWish(userId: string, input: CreateWishInput) {
  const now = new Date();
  const { note, status, links, ...fields } = input;
  const wish = await db.wish.create({
    data: {
      ...fields,
      status,
      userId,
      fulfilledOn: nextFulfilledOn({ status: "PENDING", fulfilledOn: null }, status, now),
      links: { create: linkRows(links) },
      statusChanges: { create: { status, note, noteUpdatedAt: note ? now : null } },
    },
    select: { id: true },
  });
  return wish.id;
}

export async function updateWish(userId: string, id: string, input: WishFieldsInput) {
  const { links, ...fields } = input;
  return db.$transaction(async (tx) => {
    const owned = await tx.wish.findFirst({ where: { id, userId }, select: { id: true } });
    if (!owned) return false;
    await tx.wish.update({
      where: { id },
      data: { ...fields, links: { deleteMany: {}, create: linkRows(links) } },
    });
    return true;
  });
}

export async function deleteWish(userId: string, id: string) {
  const { count } = await db.wish.deleteMany({ where: { id, userId } });
  return count > 0;
}

export async function changeWishStatus(
  userId: string,
  id: string,
  status: WishStatusValue,
  note: string | null,
) {
  return db.$transaction(async (tx) => {
    const wish = await tx.wish.findFirst({
      where: { id, userId },
      select: { status: true, fulfilledOn: true },
    });
    if (!wish) return false;

    const now = new Date();
    await tx.wish.update({
      where: { id },
      data: {
        status,
        fulfilledOn: nextFulfilledOn(wish, status, now),
        statusChanges: { create: { status, note, noteUpdatedAt: note ? now : null } },
      },
    });
    return true;
  });
}

export async function updateWishNote(userId: string, id: string, note: string | null) {
  return db.$transaction(async (tx) => {
    const latest = await tx.wishStatusChange.findFirst({
      where: { wishId: id, wish: { userId } },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    if (!latest) return false;

    const now = new Date();
    await tx.wishStatusChange.update({
      where: { id: latest.id },
      data: { note, noteUpdatedAt: note ? now : null },
    });
    await tx.wish.update({ where: { id }, data: { updatedAt: now } });
    return true;
  });
}
