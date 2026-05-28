import express from "express";
import { usersController } from "../controllers/users.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { clearAuthCookie, setAuthCookie } from "../utils/cookies.js";
import { validateCredentials } from "../utils/validation.js";

export const usersRouter = express.Router();

usersRouter.get(
  "/usernameAvailable/:username",
  asyncHandler(async (request, response) => {
    const username = String(request.params.username ?? "");
    if (!username) {
      response.status(400).json({ success: false, message: "Username missing" });
      return;
    }

    const success = await usersController.isUsernameAvailable(username);
    response.json({ success });
  })
);

usersRouter.post(
  "/register",
  asyncHandler(async (request, response) => {
    const { username, password } = request.body;
    const validationError = validateCredentials(username, password);
    if (validationError) {
      response.status(400).json({ success: false, message: validationError });
      return;
    }

    const result = await usersController.register(username, password);
    if (!result) {
      response
        .status(409)
        .json({ success: false, message: "Username already taken" });
      return;
    }

    setAuthCookie(response, result.token);
    response.json({ success: true, user: result.user });
  })
);

usersRouter.post(
  "/login",
  asyncHandler(async (request, response) => {
    const { username, password } = request.body;
    const validationError = validateCredentials(username, password);
    if (validationError) {
      response.status(400).json({ success: false, message: validationError });
      return;
    }

    const result = await usersController.login(username, password);
    if (!result) {
      response.status(401).json({ success: false, message: "Bad credentials" });
      return;
    }

    setAuthCookie(response, result.token);
    response.json({ success: true, user: result.user });
  })
);

usersRouter.post("/logout", (_request, response) => {
  clearAuthCookie(response);
  response.json({ success: true });
});

usersRouter.get(
  "/checkAuth",
  asyncHandler(async (request, response) => {
    const token = request.cookies?.token as string | undefined;
    if (!token) {
      response.json({ success: false });
      return;
    }

    const user = await usersController.getAuthUserFromToken(token);
    if (!user) {
      clearAuthCookie(response);
      response.json({ success: false });
      return;
    }

    response.json({ success: true, user });
  })
);
