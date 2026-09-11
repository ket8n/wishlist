"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";

import { requireUser } from "@/lib/auth/session";
import * as wishes from "@/lib/services/wishes";
import {
  changeStatusSchema,
  createWishSchema,
  updateNoteSchema,
  updateWishSchema,
  wishId,
} from "@/lib/validation/wish";

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

const NOT_FOUND = "We couldn't find that wish.";
const FAILED = "Something went wrong. Please try again.";

function invalid(error: z.ZodError): ActionResult<never> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
}

function refresh(id?: string) {
  revalidatePath("/dashboard");
  if (id) revalidatePath(`/wish/${id}`);
}

// requireUser() stays outside try: its redirect is thrown and must propagate.
async function run<T>(fn: () => Promise<ActionResult<T>>): Promise<ActionResult<T>> {
  try {
    return await fn();
  } catch (error) {
    console.error("[wish action]", error);
    return { ok: false, error: FAILED };
  }
}

export async function createWishAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();
  const parsed = createWishSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  return run(async () => {
    const id = await wishes.createWish(user.id, parsed.data);
    refresh();
    return { ok: true, data: { id } };
  });
}

export async function updateWishAction(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = updateWishSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { id, ...fields } = parsed.data;

  return run(async () => {
    if (!(await wishes.updateWish(user.id, id, fields))) return { ok: false, error: NOT_FOUND };
    refresh(id);
    return { ok: true, data: undefined };
  });
}

export async function deleteWishAction(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = wishId.safeParse(input);
  if (!parsed.success) return { ok: false, error: NOT_FOUND };

  return run(async () => {
    if (!(await wishes.deleteWish(user.id, parsed.data))) return { ok: false, error: NOT_FOUND };
    refresh(parsed.data);
    return { ok: true, data: undefined };
  });
}

export async function changeWishStatusAction(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = changeStatusSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { id, status, note } = parsed.data;

  return run(async () => {
    if (!(await wishes.changeWishStatus(user.id, id, status, note))) {
      return { ok: false, error: NOT_FOUND };
    }
    refresh(id);
    return { ok: true, data: undefined };
  });
}

export async function updateWishNoteAction(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = updateNoteSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { id, note } = parsed.data;

  return run(async () => {
    if (!(await wishes.updateWishNote(user.id, id, note))) return { ok: false, error: NOT_FOUND };
    refresh(id);
    return { ok: true, data: undefined };
  });
}
