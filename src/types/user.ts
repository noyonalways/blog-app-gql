export type TUserRegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type TUserLoginPayload = {
  email: string;
  password: string;
};

export type TDecodedToken = {
  id: string;
  email: string;
  iat: number;
  exp: number;
};

export type TUserProfilePayload = {
  avatar: string;
  bio: string;
};
