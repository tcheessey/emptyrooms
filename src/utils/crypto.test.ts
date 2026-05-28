import { describe, expect, it } from "vitest";
import { createPasswordHash, verifyPassword } from "./crypto.js";

describe("password hashing", () => {
  it("verifies the original password", () => {
    const { salt, hash } = createPasswordHash("correct-horse");

    expect(verifyPassword("correct-horse", salt, hash)).toBe(true);
  });

  it("rejects a different password", () => {
    const { salt, hash } = createPasswordHash("correct-horse");

    expect(verifyPassword("wrong-horse", salt, hash)).toBe(false);
  });
});
