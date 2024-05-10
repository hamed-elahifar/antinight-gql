export type JwtPayload = {
  id: string;
  username: string;
  roles?: string | string[];
};
