import type { WISH_CATEGORIES, WISH_PRIORITIES, WishStatusValue } from "@/lib/validation/wish";

export const STATUS_LABEL: Record<WishStatusValue, string> = {
  PENDING: "Pending",
  BOUGHT: "Bought",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
};

export const PRIORITY_LABEL: Record<(typeof WISH_PRIORITIES)[number], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const CATEGORY_LABEL: Record<(typeof WISH_CATEGORIES)[number], string> = {
  ELECTRONICS: "Electronics",
  CLOTHING: "Clothing",
  FITNESS: "Fitness",
  BOOKS: "Books",
  TRAVEL: "Travel",
  EDUCATION: "Education",
  HOME: "Home",
  OTHER: "Other",
};

const WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
  "nineteen", "twenty",
];

// Prose numbers: words for 0–20, digits above.
export function countInWords(n: number, capitalize = false) {
  const word = n >= 0 && n <= 20 ? WORDS[n] : String(n);
  return capitalize ? word.charAt(0).toUpperCase() + word.slice(1) : word;
}

export function plural(n: number, one: string, many: string) {
  return n === 1 ? one : many;
}

export function formatPrice(amount: string | null, currency: string) {
  if (amount === null) return null;
  const value = Number(amount);
  const digits = Number.isInteger(value) ? 0 : 2;
  try {
    return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en", {
      style: "currency",
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  } catch {
    return `${currency} ${amount}`;
  }
}

const DAY_MS = 86_400_000;

export function daysInList(createdAt: Date, now = new Date()) {
  return Math.max(0, Math.floor((now.getTime() - createdAt.getTime()) / DAY_MS));
}

export const LONG_WAIT_DAYS = 30;
