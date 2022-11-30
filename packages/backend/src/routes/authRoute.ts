const router = require("express").Router();
const passport = require("passport");
import { authUser, changePassword, forgotPassword, logout, register, verify } from "../controllers/authController";
import { EUserType, IProfile, IRequest, IUser } from "../utils/types";
import { Request, Response } from "express";
import { generateToken, httpErrorHandler } from "../utils/helpers";
import { REDIRECT_URL } from "../utils/constants";
import { sendSocialSignupEmail } from "../utils/sendEmail";
import { jwtAuth } from "../config/passport";

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));
router.get("/google/callback", (req: IRequest, res: Response, next: Function) => {
  let token = "";
  passport.authenticate(
    "google",
    {
      failureRedirect: REDIRECT_URL,
      successRedirect: `${REDIRECT_URL}/${token}`,
      prompt: "select_account",
      scope: ["profile", "email"],
    },
    async (rq: Request, rs: IProfile) => {
      try {
        token = rs.session;
        req.session.user = rs;
        if (rs.isNewUser) sendSocialSignupEmail(rs.email);
        res.redirect(`${REDIRECT_URL}/${token}`);
      } catch (ex) {
        console.error({ ex });
        res.redirect(REDIRECT_URL);
      }
    }
  )(req, res, next);
});

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", (req: IRequest, res: Response, next: Function) => {
  let token = "";
  passport.authenticate(
    "facebook",
    {
      failureRedirect: REDIRECT_URL,
      successRedirect: `${REDIRECT_URL}/${token}`,
      scope: ["email"],
    },
    async (rq: Request, rs: IProfile) => {
      try {
        token = rs.session;
        req.session.user = rs;
        if (rs.isNewUser) sendSocialSignupEmail(rs.email);
        res.redirect(`${REDIRECT_URL}/${token}`);
      } catch (ex) {
        res.redirect(REDIRECT_URL);
      }
    }
  )(req, res, next);
});

router.get("/", authUser);
router.post("/register", register);
router.get("/verify", verify);
router.post("/change-password", jwtAuth, changePassword);
router.post("/forgot-password", forgotPassword);
router.get("/logout", logout);
router.post("/login", (req: Request, res: Response) => {
  passport.authenticate("local", { session: false }, (err: string, user: IUser, msg: string) => {
    if (err) {
      return httpErrorHandler(res, 401, err);
    }
    if (!user) {
      return httpErrorHandler(res, 401, msg);
    }
    return res.status(200).json({ ...user, session: `${EUserType.CUSTOM}:${generateToken(user)}` });
  })(req, res);
});

module.exports = router;
