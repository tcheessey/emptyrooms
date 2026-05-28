import { db } from "../database.js";
import { createPasswordHash, verifyPassword } from "../utils/crypto.js";
import { createAuthToken, verifyAuthToken } from "../utils/jwt.js";
import type { AuthUser } from "../types/auth.js";

type UserRow = {
  id: number;
  username: string;
  display_name: string;
  color: string;
  sprite_key: string;
  last_room_id: number | null;
  last_x: number;
  last_y: number;
  facing: string;
  salt: string;
  hash: string;
  isAdmin: boolean;
};

const toAuthUser = (user: Pick<UserRow, "id" | "username" | "isAdmin">): AuthUser => ({
  id: user.id,
  username: user.username,
  isAdmin: Boolean(user.isAdmin),
});

const getUserByUsername = async (username: string) => {
  return db<UserRow>("users").where({ username }).first();
};

export const usersController = {
  async isUsernameAvailable(username: string) {
    const user = await getUserByUsername(username);
    return !user;
  },

  async register(username: string, password: string) {
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return null;
    }

    const { salt, hash } = createPasswordHash(password);
    const [insertedUserId] = await db<UserRow>("users").insert({
      username,
      display_name: username,
      salt,
      hash,
    });

    const insertedUser = await db<UserRow>("users")
      .where({ id: Number(insertedUserId) })
      .first();

    if (!insertedUser) {
      throw new Error("Failed to load registered user");
    }

    const authUser = toAuthUser(insertedUser);
    const token = createAuthToken({ sub: authUser.id, username: authUser.username });

    return { token, user: authUser };
  },

  async login(username: string, password: string) {
    const user = await getUserByUsername(username);
    if (!user) {
      return null;
    }

    if (!verifyPassword(password, user.salt, user.hash)) {
      return null;
    }

    const authUser = toAuthUser(user);
    const token = createAuthToken({ sub: authUser.id, username: authUser.username });

    return { token, user: authUser };
  },

  async getAuthUserFromToken(token: string) {
    const payload = verifyAuthToken(token);
    if (!payload) {
      return null;
    }

    const user = await db<UserRow>("users").where({ id: payload.sub }).first();
    if (!user) {
      return null;
    }

    return toAuthUser(user);
  },
};
