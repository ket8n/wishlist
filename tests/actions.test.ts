import { beforeEach, describe, expect, it, vi } from "vitest";

const services = vi.hoisted(() => ({
  createWish: vi.fn(),
  getWish: vi.fn(),
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
  saveWishAction,
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

  it("saves fields, and touches status or note only when they changed", async () => {
    const current = { id: "w1", status: "PENDING", note: "Still thinking" };
    services.getWish.mockResolvedValue(current);
    services.updateWish.mockResolvedValue(true);
    const fields = { id: "w1", name: "Kindle", status: "PENDING", note: "Still thinking" };

    expect(await saveWishAction(fields)).toEqual({ ok: true, data: undefined });
    expect(services.updateWish).toHaveBeenCalledWith("user-a", "w1", expect.objectContaining({ name: "Kindle" }));
    expect(services.changeWishStatus).not.toHaveBeenCalled();
    expect(services.updateWishNote).not.toHaveBeenCalled();

    await saveWishAction({ ...fields, status: "BOUGHT", note: "Got it" });
    expect(services.changeWishStatus).toHaveBeenCalledWith("user-a", "w1", "BOUGHT", "Got it");

    vi.clearAllMocks();
    services.getWish.mockResolvedValue(current);
    services.updateWish.mockResolvedValue(true);
    await saveWishAction({ ...fields, note: "Changed my mind" });
    expect(services.updateWishNote).toHaveBeenCalledWith("user-a", "w1", "Changed my mind");
    expect(services.changeWishStatus).not.toHaveBeenCalled();
  });

  it("refuses to save another user's wish", async () => {
    services.getWish.mockResolvedValue(null);
    expect(await saveWishAction({ id: "w-other", name: "x", status: "PENDING" })).toEqual({
      ok: false,
      error: "We couldn't find that wish.",
    });
    expect(services.updateWish).not.toHaveBeenCalled();
  });

  it("hides internal errors", async () => {
    services.changeWishStatus.mockRejectedValue(new Error("connection reset by peer"));
    const result = await changeWishStatusAction({ id: "w1", status: "REJECTED" });
    expect(result).toEqual({ ok: false, error: "Something went wrong. Please try again." });
  });
});
