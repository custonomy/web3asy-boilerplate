const router = require("express").Router();
const passport = require("passport");
import { authUser, changePassword, forgotPassword, logout, register, verify } from "../controllers/authController";
import { IUser } from "../utils/types";
import { Request, Response } from "express";
import { generateToken, httpErrorHandler } from "../utils/helpers";
import { REDIRECT_URL, USER_TYPE } from "../utils/constants";
import { sendSocialSignupEmail } from "../utils/sendEmail";
import { jwtAuth } from "../config/passport";
// const request = require("request");

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));
router.get("/google/callback", (req: any, res: any, next: any) => {
  let token = "";
  passport.authenticate(
    "google",
    {
      failureRedirect: REDIRECT_URL,
      successRedirect: `${REDIRECT_URL}/${token}`,
      prompt: "select_account",
      scope: ["profile", "email"],
    },
    async (rq: any, rs: any) => {
      try {
        if (rs) {
          token = rs.session;
          req.session.user = rs;
          if (rs.isNewUser) sendSocialSignupEmail(rs.email, req.headers.host ?? "");
          res.redirect(`${REDIRECT_URL}/${token}`);
        }        
      } catch (ex) {
        console.error({ ex });
        res.redirect(REDIRECT_URL);
      }
    }
  )(req, res, next);
});

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", (req: any, res: any, next: any) => {
  let token = "";
  passport.authenticate(
    "facebook",
    {
      failureRedirect: REDIRECT_URL,
      successRedirect: `${REDIRECT_URL}/${token}`,
      scope: ["email"],
    },
    (rq: any, rs: any) => {
      try {
        token = rs.session;
        req.session.user = rs;
        if (rs.isNewUser) sendSocialSignupEmail(rs.email, req.headers.host ?? "");
        res.redirect(`${REDIRECT_URL}/${token}`);
      } catch (ex) {
        res.redirect(REDIRECT_URL);
      }
    }
  )(req, res, next);
});

// TODO: TWITTER
// router.get("/twitter", passport.authenticate("twitter"));
// router.get("/twitter/callback", passport.authenticate("twitter", { failureRedirect: "/login/failed" }), function (req: any, res: any) {
//   res.redirect("/");
// });
// router.get("/twitter/callback", (req: any, res: any, next: any) => {
//   let token = "";
//   passport.authenticate(
//     "twitter",
//     {
//       failureRedirect: "/login/failed",
//       successRedirect: `${REDIRECT_URL}/${token}`,
//       // scope: ["email"],
//     },
//     (rq: any, rs: any) => {
//       console.log({req, query: req.query})
//       res.redirect(REDIRECT_URL)
//       // token = rs.token;
//       // req.session.user = rs;
//       // res.redirect(`${REDIRECT_URL}/${rs.token}`);
//     }
//   )(req, res, next);
// });

router.get("/", authUser);
router.post("/register", register);
router.get("/verify", verify);
router.post("/change-password", jwtAuth, changePassword);
router.post("/forgot-password", forgotPassword);
// router.get("/login/failed", loginFailure);
router.get("/logout", logout);
router.post("/login", (req: Request, res: Response) => {
  passport.authenticate("local", { session: false }, (err: any, user: IUser, msg: any) => {
    if (err) {
      return httpErrorHandler(res, 401, err);
    }
    if (!user) {
      return httpErrorHandler(res, 401, msg);
    }
    return res.status(200).json({ ...user, session: `${USER_TYPE.CUSTOM}:${generateToken(user)}` });
  })(req, res);
});

module.exports = router;
