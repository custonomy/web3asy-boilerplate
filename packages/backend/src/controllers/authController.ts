import { validateUser, httpErrorHandler, generatePassword, getHashedPassword, passwordStrength, generateToken } from "../utils/helpers";
import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import { sendChangePasswordEmail, sendForgotPasswordEmail, sendOTPEmail } from "../utils/sendEmail";
import { SECRET, USER_TYPE } from "../utils/constants";
import Model from "../models/Model";
const jwt = require("jsonwebtoken");

export const authUser = async (req: any, res: Response) => {
  try {
    const user = await validateUser(req, res);
    if (user.id) {
      res.status(200).send(user);
    }
  } catch (error: any) {
    let newError = error;
    req.logout((err: any) => {
      if (err) newError = err;
    });
    httpErrorHandler(res, 400, newError);
  }
};

export const logout = async (req: any, res: Response) => {
  try {
    req.logout((err: any) => {
      if (err) throw err;
    });
    res.status(200).send({ message: "Logged out" });
  } catch (error: any) {
    httpErrorHandler(res, 400, error);
  }
};

export const register = async (req: Request, res: Response) => {
  const { email } = req.body;
  const password = generatePassword();
  const profile: any = { id: null, email, externalId: null, type: "INTERNAL", password };

  if (!email) {
    return httpErrorHandler(res, 400, "Missing email");
  }

  const trx = await Model.lock();
  try {
    const user: any = await UserModel.getByPrimaryKey(profile, false, trx);
    if (user) {
      await Model.commit(trx);
      return httpErrorHandler(res, 400, "User already exists");
    }

    const newUser = await UserModel.create(profile, trx);
    await Model.commit(trx);

    sendOTPEmail(email, password, req.headers.host ?? "");
    res.status(200).send({ ...newUser, session: `${USER_TYPE.CUSTOM}:${generateToken(newUser)}` });
  } catch (error) {
    Model.rollback(trx, error);
    return httpErrorHandler(res, 400, JSON.stringify(error));
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
    const user: any = await UserModel.getByPrimaryKey({ id, type: USER_TYPE.INTERNAL, email: null }, false, trx);
    // const user: any = await UserModel.getByPrimaryKey({ id, type: USER_TYPE.INTERNAL, email: null, externalId: null });
    if (!user) {
      await Model.commit(trx);
      return httpErrorHandler(res, 400, "User not found");
    }

    const newUser = await UserModel.update({ id, password, firstTimeLogin: false }, trx);
    await Model.commit(trx);

    sendChangePasswordEmail(newUser?.email ?? "", req.headers.host ?? "");
    res.status(200).send(newUser);
  } catch (error) {
    Model.rollback(trx, error);
    return httpErrorHandler(res, 400, JSON.stringify(error));
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const trx = await Model.lock();
  try {
    const user: any = await UserModel.getByPrimaryKey({ id: null, type: USER_TYPE.INTERNAL, email }, false, trx);
    // const user: any = await UserModel.getByPrimaryKey({ id: null, type: USER_TYPE.INTERNAL, email, externalId: null });
    if (!user) {
      await Model.commit(trx);
      return httpErrorHandler(res, 400, "User not found");
    }

    const password = generatePassword();
    const newUser = await UserModel.update({ id: user.id, password, firstTimeLogin: true }, trx);
    await Model.commit(trx);

    sendForgotPasswordEmail(email, password, req.headers.host ?? "");
    res.status(200).send({ message: "A reset password email has been sent to your mailbox." });
  } catch (error) {
    Model.rollback(trx, error);
    return httpErrorHandler(res, 400, JSON.stringify(error));
  }
};

export const verify = async (req: Request, res: Response) => {
  const { token } = req.query;
  jwt.verify(token, SECRET, async function (err: any, decoded: any) {
    if (err) {
      return httpErrorHandler(res, 401, "JWT expired");
    }
    const trx = await Model.lock();
    try {
      const user: any = await UserModel.getByPrimaryKey({ id: decoded.id, type: USER_TYPE.INTERNAL, email: null }, false, trx);
      // const user: any = await UserModel.getByPrimaryKey({ id: decoded.id, type: USER_TYPE.INTERNAL, email: null, externalId: null });
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
