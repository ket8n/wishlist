import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => {
  const mock = {
    wish: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    wishStatusChange: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  };
  mock.$transaction.mockImplementation((fn: (tx: typeof mock) => unknown) => fn(mock));
  return mock;
});

vi.mock("@/lib/db", () => ({ db }));

import * as wishes from "@/lib/services/wishes";

const USER = "user-a";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ownership scoping", () => {
  it("getWish only looks up the caller's wish and hides others", async () => {
    db.wish.findFirst.mockResolvedValue(null);
    expect(await wishes.getWish(USER, "w-other")).toBeNull();
    expect(db.wish.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "w-other", userId: USER } }),
    );
  });

  it("getUserWishes is scoped to the caller", async () => {
    db.wish.findMany.mockResolvedValue([]);
    await wishes.getUserWishes(USER);
    expect(db.wish.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: USER }, orderBy: { updatedAt: "desc" } }),
    );
  });

  it("deleteWish reports false for another user's wish", async () => {
    db.wish.deleteMany.mockResolvedValue({ count: 0 });
    expect(await wishes.deleteWish(USER, "w-other")).toBe(false);
    expect(db.wish.deleteMany).toHaveBeenCalledWith({ where: { id: "w-other", userId: USER } });
  });

  it("updateWish does not write when the wish is not owned", async () => {
    db.wish.findFirst.mockResolvedValue(null);
    const ok = await wishes.updateWish(USER, "w-other", {
      name: "x",
      description: null,
      category: "OTHER",
      priority: "MEDIUM",
      estimatedPrice: null,
      currency: "INR",
      images: [],
      links: [],
    });
    expect(ok).toBe(false);
    expect(db.wish.update).not.toHaveBeenCalled();
  });

  it("changeWishStatus does not write when the wish is not owned", async () => {
    db.wish.findFirst.mockResolvedValue(null);
    expect(await wishes.changeWishStatus(USER, "w-other", "BOUGHT", null)).toBe(false);
    expect(db.wish.update).not.toHaveBeenCalled();
  });

  it("updateWishNote only targets the caller's wish history", async () => {
    db.wishStatusChange.findFirst.mockResolvedValue(null);
    expect(await wishes.updateWishNote(USER, "w-other", "hi")).toBe(false);
    expect(db.wishStatusChange.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { wishId: "w-other", wish: { userId: USER } } }),
    );
    expect(db.wishStatusChange.update).not.toHaveBeenCalled();
  });
});

describe("createWish", () => {
  it("assigns the owner and records the initial status", async () => {
    db.wish.create.mockResolvedValue({ id: "w1" });
    const id = await wishes.createWish(USER, {
      name: "Ladakh trip",
      description: null,
      category: "TRAVEL",
      priority: "HIGH",
      estimatedPrice: "45000.00",
      currency: "INR",
      images: [],
      links: [{ label: "Guide", url: "https://example.com" }],
      status: "PENDING",
      note: "Before winter",
    });

    expect(id).toBe("w1");
    const { data } = db.wish.create.mock.calls[0][0];
    expect(data.userId).toBe(USER);
    expect(data.fulfilledOn).toBeNull();
    expect(data.links.create).toEqual([{ label: "Guide", url: "https://example.com", position: 0 }]);
    expect(data.statusChanges.create).toMatchObject({ status: "PENDING", note: "Before winter" });
    expect(data.statusChanges.create.noteUpdatedAt).toBeInstanceOf(Date);
  });
});

describe("changeWishStatus", () => {
  it("records history and sets fulfilledOn when bought", async () => {
    db.wish.findFirst.mockResolvedValue({ status: "PENDING", fulfilledOn: null });
    expect(await wishes.changeWishStatus(USER, "w1", "BOUGHT", "Finally")).toBe(true);

    const { where, data } = db.wish.update.mock.calls[0][0];
    expect(where).toEqual({ id: "w1" });
    expect(data.status).toBe("BOUGHT");
    expect(data.fulfilledOn).toBeInstanceOf(Date);
    expect(data.statusChanges.create).toMatchObject({ status: "BOUGHT", note: "Finally" });
  });

  it("clears fulfilledOn when moved back to pending", async () => {
    db.wish.findFirst.mockResolvedValue({ status: "BOUGHT", fulfilledOn: new Date() });
    await wishes.changeWishStatus(USER, "w1", "PENDING", null);

    const { data } = db.wish.update.mock.calls[0][0];
    expect(data.fulfilledOn).toBeNull();
    expect(data.statusChanges.create).toMatchObject({ status: "PENDING", note: null });
  });
});
