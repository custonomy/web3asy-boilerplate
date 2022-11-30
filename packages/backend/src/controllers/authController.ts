import { validateUser, httpErrorHandler, generatePassword, passwordStrength, generateToken } from "../utils/helpers";
import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import { sendChangePasswordEmail, sendForgotPasswordEmail, sendOTPEmail } from "../utils/sendEmail";
import Model from "../models/Model";
import { EUserType, IRequest, TUserType } from "../utils/types";
import { JWT_SECRET } from "../utils/constants";
import { JwtPayload, VerifyErrors } from "jsonwebtoken";
const jwt = require("jsonwebtoken");

export const authUser = async (req: IRequest, res: Response) => {
  try {
    const user = await validateUser(req, res);
    if (user.id) {
      res.status(200).send(user);
    }
  } catch (error: unknown) {
    req.logout();
    httpErrorHandler(res, 401, error);
  }
};

export const logout = async (req: IRequest, res: Response) => {
  try {
    req.logout();
    res.status(200).send({ message: "Logged out" });
  } catch (error: unknown) {
    httpErrorHandler(res, 401, error);
  }
};

export const register = async (req: Request, res: Response) => {
  const { email } = req.body;
  const password = generatePassword();
  const profile = { id: null, email, externalId: null, type: "INTERNAL" as TUserType, password };

  if (!email) {
    return httpErrorHandler(res, 401, "Missing email");
  }

  const trx = await Model.lock();
  try {
    const user = await UserModel.getByPrimaryKey(profile, false, trx);
    if (user) {
      await Model.commit(trx);
      return httpErrorHandler(res, 401, "User already exists");
    }

    const newUser = await UserModel.create(profile, trx);
    await Model.commit(trx);

    sendOTPEmail(email, password);
    res.status(200).send({ ...newUser, session: `${EUserType.CUSTOM}:${generateToken(newUser)}` });
  } catch (error) {
    Model.rollback(trx, error);
    return httpErrorHandler(res, 401, JSON.stringify(error));
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { id, password } = req.body;
  const strength = passwordStrength(password);
  if (strength.type === "error") {
    return httpErrorHandler(res, 400, "Password is not strong enough");
  }

  const trx = await Model.lock();
  try {
    const user = await UserModel.getByPrimaryKey({ id, type: EUserType.INTERNAL, email: null }, false, trx);
    if (!user) {
      await Model.commit(trx);
      return httpErrorHandler(res, 401, "User not found");
    }

    const newUser = await UserModel.update({ id, password, firstTimeLogin: false }, trx);
    await Model.commit(trx);

    sendChangePasswordEmail(newUser?.email ?? "");
    res.status(200).send(newUser);
  } catch (error) {
    Model.rollback(trx, error);
    return httpErrorHandler(res, 401, JSON.stringify(error));
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const trx = await Model.lock();
  try {
    const user = await UserModel.getByPrimaryKey({ id: null, type: EUserType.INTERNAL, email }, false, trx);
    if (!user) {
      await Model.commit(trx);
      return httpErrorHandler(res, 401, "User not found");
    }

    const password = generatePassword();
    await UserModel.update({ id: user.id, password, firstTimeLogin: true }, trx);
    await Model.commit(trx);

    sendForgotPasswordEmail(email, password);
    res.status(200).send({ message: "A reset password email has been sent to your mailbox." });
  } catch (error) {
    Model.rollback(trx, error);
    return httpErrorHandler(res, 401, JSON.stringify(error));
  }
};

export const verify = async (req: Request, res: Response) => {
  const { token } = req.query;
  jwt.verify(token, JWT_SECRET, async function (err: VerifyErrors | null, decoded: JwtPayload | undefined) {
    if (err) {
      return httpErrorHandler(res, 401, "JWT expired");
    }
    const trx = await Model.lock();
    try {
      const user = await UserModel.getByPrimaryKey({ id: decoded?.id, type: EUserType.INTERNAL, email: null }, false, trx);
      if (!user) {
        await Model.commit(trx);
        return httpErrorHandler(res, 401, "User not found");
      }
      await Model.commit(trx);

      res.status(200).send(user);
    } catch (error) {
      Model.rollback(trx, error);
      return httpErrorHandler(res, 401, JSON.stringify(error));
    }
  });
};

