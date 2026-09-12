import { describe, expect, it } from "vitest";

import {
  changeStatusSchema,
  createWishSchema,
  updateWishSchema,
  wishDraftSchema,
} from "@/lib/validation/wish";

describe("createWishSchema", () => {
  it("requires a name and applies defaults", () => {
    expect(createWishSchema.safeParse({ name: "   " }).success).toBe(false);

    const result = createWishSchema.parse({ name: "  Sony WH-1000XM6  " });
    expect(result).toMatchObject({
      name: "Sony WH-1000XM6",
      status: "PENDING",
      priority: "MEDIUM",
      category: "OTHER",
      currency: "INR",
      description: null,
      estimatedPrice: null,
      note: null,
      images: [],
      links: [],
    });
  });

  it("strips client-supplied ownership fields", () => {
    const result = createWishSchema.parse({ name: "x", userId: "someone-else", id: "x" });
    expect(result).not.toHaveProperty("userId");
    expect(result).not.toHaveProperty("id");
  });

  it.each(["javascript:alert(1)", "ftp://example.com/a.png", "not a url", "data:image/png;base64,AA"])(
    "rejects unsafe URL %s",
    (url) => {
      expect(createWishSchema.safeParse({ name: "x", images: [url] }).success).toBe(false);
      expect(
        createWishSchema.safeParse({ name: "x", links: [{ label: "Shop", url }] }).success,
      ).toBe(false);
    },
  );

  it("accepts http(s) URLs", () => {
    const result = createWishSchema.parse({
      name: "x",
      images: ["https://example.com/a.png"],
      links: [{ label: " Amazon ", url: "http://amazon.in/dp/1" }],
    });
    expect(result.links).toEqual([{ label: "Amazon", url: "http://amazon.in/dp/1" }]);
  });

  it("normalises prices and rejects invalid ones", () => {
    expect(createWishSchema.parse({ name: "x", estimatedPrice: "34990" }).estimatedPrice).toBe(
      "34990.00",
    );
    expect(createWishSchema.parse({ name: "x", estimatedPrice: 12.5 }).estimatedPrice).toBe("12.50");
    expect(createWishSchema.parse({ name: "x", estimatedPrice: "" }).estimatedPrice).toBeNull();
    for (const bad of ["abc", -1, "1e20"]) {
      expect(createWishSchema.safeParse({ name: "x", estimatedPrice: bad }).success).toBe(false);
    }
  });

  it("rejects values outside the constrained sets", () => {
    expect(createWishSchema.safeParse({ name: "x", status: "ARCHIVED" }).success).toBe(false);
    expect(createWishSchema.safeParse({ name: "x", priority: "URGENT" }).success).toBe(false);
    expect(createWishSchema.safeParse({ name: "x", category: "CARS" }).success).toBe(false);
    expect(createWishSchema.safeParse({ name: "x", currency: "RUPEES" }).success).toBe(false);
  });

  it("enforces length and count limits", () => {
    expect(createWishSchema.safeParse({ name: "a".repeat(121) }).success).toBe(false);
    const links = Array.from({ length: 11 }, () => ({ label: "L", url: "https://a.com" }));
    expect(createWishSchema.safeParse({ name: "x", links }).success).toBe(false);
  });
});

describe("wishDraftSchema", () => {
  it("carries quick-create values over to the full page", () => {
    expect(
      wishDraftSchema.parse({
        name: " Kindle ",
        description: "for the commute",
        category: "ELECTRONICS",
        priority: "HIGH",
        estimatedPrice: "14999",
        note: "maybe after payday",
      }),
    ).toMatchObject({
      name: "Kindle",
      description: "for the commute",
      category: "ELECTRONICS",
      priority: "HIGH",
      estimatedPrice: "14999",
      note: "maybe after payday",
    });
  });

  it("drops junk instead of failing", () => {
    const result = wishDraftSchema.parse({
      name: "a".repeat(500),
      category: "CARS",
      priority: "URGENT",
    });
    expect(result.category).toBeUndefined();
    expect(result.priority).toBeUndefined();
    expect(result.name).toBeUndefined();
  });
});

describe("updateWishSchema / changeStatusSchema", () => {
  it("requires an id", () => {
    expect(updateWishSchema.safeParse({ name: "x" }).success).toBe(false);
    expect(changeStatusSchema.safeParse({ status: "BOUGHT" }).success).toBe(false);
  });

  it("treats an empty note as no note", () => {
    expect(changeStatusSchema.parse({ id: "w1", status: "BOUGHT", note: "  " }).note).toBeNull();
  });
});
