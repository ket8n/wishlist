import type { WishStatusValue } from "@/lib/validation/wish";

export function isFulfilled(status: WishStatusValue) {
  return status === "BOUGHT" || status === "COMPLETED";
}

export function isTerminal(status: WishStatusValue) {
  return status !== "PENDING";
}

const COMPLETABLE = ["TRAVEL", "EDUCATION", "FITNESS"];

// Deterministic per category, so the verb never changes at runtime.
export function primaryActionFor(category: string, status: WishStatusValue) {
  if (isTerminal(status)) return { status: "PENDING" as const, label: "Move back to pending" };
  return COMPLETABLE.includes(category)
    ? { status: "COMPLETED" as const, label: "Mark as completed" }
    : { status: "BOUGHT" as const, label: "Mark as bought" };
}

export function statusDialogTitle(status: WishStatusValue) {
  if (status === "BOUGHT") return "Mark as bought";
  if (status === "COMPLETED") return "Mark as completed";
  if (status === "REJECTED") return "Not going ahead";
  return "Move back to pending";
}

// Keeps the original date when moving between Bought and Completed.
export function nextFulfilledOn(
  current: { status: WishStatusValue; fulfilledOn: Date | null },
  next: WishStatusValue,
  now: Date,
): Date | null {
  if (!isFulfilled(next)) return null;
  if (isFulfilled(current.status) && current.fulfilledOn) return current.fulfilledOn;
  return now;
}
