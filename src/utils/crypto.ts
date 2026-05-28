import crypto from "node:crypto";

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

export const createPasswordHash = (password: string) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");

  return { salt, hash };
};

export const verifyPassword = (password: string, salt: string, hash: string) => {
  const candidateHash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");

  return candidateHash === hash;
};
