import { prisma } from "../../prisma/prisma";

export const getAccountById = async (userId: string) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        userId: userId,
      },
    });
    return account;
  } catch (err) {
    console.error(`Failed to fetch account: ${err}`);
    return null;
  }
};
