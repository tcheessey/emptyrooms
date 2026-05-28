export type AuthUser = {
  id: number;
  username: string;
  isAdmin: boolean;
};

export type JwtPayload = {
  sub: number;
  username: string;
};
