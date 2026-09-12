import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => vi.fn());
const redirect = vi.hoisted(() =>
  vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
);

vi.mock("@/auth", () => ({ auth }));
vi.mock("next/navigation", () => ({ redirect }));

import { getCurrentUser, requireUser } from "@/lib/auth/session";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getCurrentUser", () => {
  it("returns null when there is no session", async () => {
    auth.mockResolvedValue(null);
    expect(await getCurrentUser()).toBeNull();
  });

  it("returns null when the session carries no user id", async () => {
    auth.mockResolvedValue({ user: { email: "someone@example.com" } });
    expect(await getCurrentUser()).toBeNull();
  });

  it("maps the session user, defaulting missing fields to null", async () => {
    auth.mockResolvedValue({ user: { id: "user-a", email: "a@example.com" } });
    expect(await getCurrentUser()).toEqual({
      id: "user-a",
      name: null,
      email: "a@example.com",
      image: null,
    });
  });
});

describe("requireUser", () => {
  it("redirects to /login when signed out", async () => {
    auth.mockResolvedValue(null);
    await expect(requireUser()).rejects.toThrow("REDIRECT:/login");
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("returns the user when signed in", async () => {
    auth.mockResolvedValue({ user: { id: "user-a", name: "A", email: "a@example.com" } });
    expect(await requireUser()).toMatchObject({ id: "user-a", name: "A" });
    expect(redirect).not.toHaveBeenCalled();
  });
});
