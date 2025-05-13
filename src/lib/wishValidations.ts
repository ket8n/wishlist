import { PriorityLevel, WishStatus } from "@/generated/prisma";
import { z } from "zod";

export const CreateWishSchema = z.object({
  name: z.string().min(1, { message: "Name of the wish is required!" }),
  description: z
    .string()
    .min(1, { message: "Description of the wish is required!" }),
  links: z.array(z.string().url({ message: "Invalid Url" })).optional(),
  status: z.nativeEnum(WishStatus).optional(),
  priority: z.nativeEnum(PriorityLevel).optional(),
  isPublic: z.boolean().optional(),
});

export const UpdateWishSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  links: z.array(z.string().url()).optional(),
  status: z.nativeEnum(WishStatus).optional(),
  priority: z.nativeEnum(PriorityLevel).optional(),
  isPublic: z.boolean().optional(),
  fulfilledOn: z.coerce.date().optional(),
});
