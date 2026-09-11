import { describe, expect, it } from "vitest";

import { nextFulfilledOn } from "@/lib/wish-status";

const now = new Date("2026-09-11T10:00:00Z");
const earlier = new Date("2026-08-01T10:00:00Z");

describe("nextFulfilledOn", () => {
  it("sets the date when a wish becomes bought or completed", () => {
    expect(nextFulfilledOn({ status: "PENDING", fulfilledOn: null }, "BOUGHT", now)).toBe(now);
    expect(nextFulfilledOn({ status: "REJECTED", fulfilledOn: null }, "COMPLETED", now)).toBe(now);
  });

  it("keeps the original date between fulfilled states", () => {
    expect(nextFulfilledOn({ status: "BOUGHT", fulfilledOn: earlier }, "COMPLETED", now)).toBe(
      earlier,
    );
  });

  it("clears the date when leaving a fulfilled state", () => {
    expect(nextFulfilledOn({ status: "BOUGHT", fulfilledOn: earlier }, "PENDING", now)).toBeNull();
    expect(
      nextFulfilledOn({ status: "COMPLETED", fulfilledOn: earlier }, "REJECTED", now),
    ).toBeNull();
  });
});
