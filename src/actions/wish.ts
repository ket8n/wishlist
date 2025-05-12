"use server";

import { prisma } from "../../prisma/prisma";
import { WishStatus, PriorityLevel } from "@/generated/prisma";

export async function createWish(data: {
  name: string;
  description: string;
  links?: string[];
  status?: WishStatus;
  priority?: PriorityLevel;
  isPublic?: boolean;
  userId: string;
}) {
  return await prisma.wish.create({
    data: {
      name: data.name,
      description: data.description,
      links: data.links || [],
      status: data.status || "PENDING",
      priority: data.priority || "MEDIUM",
      isPublic: data.isPublic || false,
      userId: data.userId,
    },
  });
}

export async function getUsersWishes(userId: string) {
  return await prisma.wish.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWishById(id: string) {
  return await prisma.wish.findUnique({ where: { id } });
}

export async function updateWish(
  id: string,
  userId: string,
  data: Partial<{
    name: string;
    description: string;
    links?: string[];
    status?: WishStatus;
    priority?: PriorityLevel;
    isPublic?: boolean;
    fulfilledOn: Date;
  }>
) {
  const wish = await prisma.wish.findUnique({ where: { id } });
  if (!wish || wish.userId !== userId) {
    throw new Error("Unauthorized or Not found");
  }

  return await prisma.wish.update({
    where: { id },
    data: { ...data, updatedAt: new Date() },
  });
}

export async function deleteWish(id: string) {
  return await prisma.wish.delete({ where: { id } });
}
