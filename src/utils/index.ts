import jwt, { SignOptions } from "jsonwebtoken";

export const generateToken = (
  jwtPayload: { id: string; email: string },
  secret: string,
  options: SignOptions,
) => {
  return jwt.sign(jwtPayload, secret, options);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};
