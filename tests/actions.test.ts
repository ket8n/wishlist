import { beforeEach, describe, expect, it, vi } from "vitest";

const services = vi.hoisted(() => ({
  createWish: vi.fn(),
  updateWish: vi.fn(),
  deleteWish: vi.fn(),
  changeWishStatus: vi.fn(),
  updateWishNote: vi.fn(),
}));

vi.mock("@/lib/services/wishes", () => services);
vi.mock("@/lib/auth/session", () => ({
  requireUser: vi.fn(async () => ({ id: "user-a", name: null, email: null, image: null })),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import {
  changeWishStatusAction,
  createWishAction,
  deleteWishAction,
  updateWishAction,
} from "@/lib/actions/wishes";

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("wish actions", () => {
  it("uses the session user, never a client-supplied userId", async () => {
    services.createWish.mockResolvedValue("w1");
    const result = await createWishAction({ name: "Kindle", userId: "user-b" });

    expect(result).toEqual({ ok: true, data: { id: "w1" } });
    const [userId, data] = services.createWish.mock.calls[0];
    expect(userId).toBe("user-a");
    expect(data).not.toHaveProperty("userId");
  });

  it("rejects invalid input without touching the database", async () => {
    const result = await createWishAction({ name: "", images: ["javascript:alert(1)"] });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors).toHaveProperty("name");
      expect(result.fieldErrors).toHaveProperty("images.0");
    }
    expect(services.createWish).not.toHaveBeenCalled();
  });

  it("returns the same not-found error for another user's wish", async () => {
    services.updateWish.mockResolvedValue(false);
    services.deleteWish.mockResolvedValue(false);
    services.changeWishStatus.mockResolvedValue(false);

    const expected = { ok: false, error: "We couldn't find that wish." };
    expect(await updateWishAction({ id: "w-other", name: "x" })).toEqual(expected);
    expect(await deleteWishAction("w-other")).toEqual(expected);
    expect(await changeWishStatusAction({ id: "w-other", status: "BOUGHT" })).toEqual(expected);
    expect(services.updateWish.mock.calls[0][0]).toBe("user-a");
  });

  it("hides internal errors", async () => {
    services.changeWishStatus.mockRejectedValue(new Error("connection reset by peer"));
    const result = await changeWishStatusAction({ id: "w1", status: "REJECTED" });
    expect(result).toEqual({ ok: false, error: "Something went wrong. Please try again." });
  });
});
