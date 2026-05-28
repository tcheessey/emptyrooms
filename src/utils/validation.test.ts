import { describe, expect, it } from "vitest";
import { validateCredentials } from "./validation.js";

describe("validateCredentials", () => {
  it("accepts a valid username and password", () => {
    expect(validateCredentials("tatiana_1", "correct-horse")).toBeNull();
  });

  it("rejects usernames with unsupported characters", () => {
    expect(validateCredentials("bad name", "correct-horse")).toBe(
      "Username can contain only letters, numbers, underscore"
    );
  });
});
