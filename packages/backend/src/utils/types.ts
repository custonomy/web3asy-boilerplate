import { Request } from "express";

export interface INewUser {
  externalId: string | null;
  email: string;
  type: TUserType;
  password?: string;
}

export interface IUser extends INewUser {
  id: string;
  password: string;
  firstTimeLogin: boolean;
}

export interface IProfile extends IUser {
  session: string;
  isNewUser: boolean;
}

export type TUserType = "GOOGLE" | "FACEBOOK" | "INTERNAL" | "CUSTOM";

export interface IUserPrimaryKey {
  id: string | null;
  email: string | null;
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

export enum EUserType {
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  INTERNAL = "INTERNAL",
  CUSTOM = "CUSTOM",
}

export interface IStrength {
  contains: string[];
  length: number;
  type?: string;
}

export interface IRequest extends Request {
  logout: Function;
  session: {
    user: IProfile;
  };
}

export interface IMailParams {
  email: string;
  password?: string;
}

export interface IMailMergeMap {
  email: string;
  password: string;
}

export interface IContent {
  password?: string;
}

export enum EEmailTemplate {
  OTP = "otp",
  FORGOT_PASSWORD = "forgotPassword",
  CHANGE_PASSWORD = "changePassword",
  SOCIAL_SIGNUP = "socialSignup",
}
