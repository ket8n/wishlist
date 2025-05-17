import { prisma } from "@/../prisma/prisma";

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  } catch (err) {
    console.error(`Failed to fetch user: ${err}`);
    return null;
  }
};
