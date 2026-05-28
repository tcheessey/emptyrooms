const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

export const validateCredentials = (username: unknown, password: unknown) => {
  if (typeof username !== "string" || typeof password !== "string") {
    return "Username and password are required";
  }

  if (username.length < 3 || username.length > 24) {
    return "Username must be 3-24 characters";
  }

  if (!USERNAME_REGEX.test(username)) {
    return "Username can contain only letters, numbers, underscore";
  }

  if (password.length < 8 || password.length > 128) {
    return "Password must be 8-128 characters";
  }

  return null;
};

