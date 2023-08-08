export interface INewUser {
  externalId: string;
  email: string;
  type: TUserType;
  password?: string;
}

export interface IUser {
  id: number;
  externalId: string;
  email: string;
  password: string;
  firstTimeLogin: boolean;
  type: TUserType;
}

export type TUserType = "GOOGLE" | "FACEBOOK" | "TWITTER" | "INTERNAL" | "CUSTOM";

export interface IUserPrimaryKey {
  id: string | null;
  email: string | null;
  // externalId: string | null;
  type: string | null;
}

export interface IExternalProfile {
  id: null;
  externalId: string;
  type: TUserType;
  email: string;
}

export interface IUpdateUser {
  id: string;
  password?: string;
  firstTimeLogin?: boolean;
}
