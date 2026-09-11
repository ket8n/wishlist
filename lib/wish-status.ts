import type { WishStatusValue } from "@/lib/validation/wish";

export function isFulfilled(status: WishStatusValue) {
  return status === "BOUGHT" || status === "COMPLETED";
}

export function isTerminal(status: WishStatusValue) {
  return status !== "PENDING";
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
