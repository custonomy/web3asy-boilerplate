import { GOOGLE_USER_PROFILE_URL, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_BASE_URL, JWT_SECRET } from "../utils/constants";
import UserModel from "../models/UserModel";
import { handleExternalProfile } from "../utils/helpers";
import { EUserType, IExternalProfile, IUser } from "../utils/types";
import Model from "../models/Model";

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
export const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt,
  LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");

let savedToken = "";

// Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${REDIRECT_BASE_URL}/api/auth/google/callback`,
      userProfileURL: GOOGLE_USER_PROFILE_URL,
    },
    async function (accessToken: string, refreshToken: string, otherTokenDetails: any, profile: any, done: Function) {
      savedToken = `${EUserType.GOOGLE}:${accessToken}`;
      const googleProfile = {
        id: null,
        externalId: profile.id,
        email: profile.emails[0].value,
        type: EUserType.GOOGLE,
      };
      await handleExternalProfile(googleProfile, savedToken, done);
    }
  )
);

// Facebook OAuth
passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: `${REDIRECT_BASE_URL}/api/auth/facebook/callback`,
      profileFields: ["id", "displayName", "emails"],
    },
    async function (accessToken: string, refreshToken: string, otherTokenDetails: any, profile: any, done: Function) {
      savedToken = `${EUserType.FACEBOOK}:${accessToken}`;
      const facebookProfile: IExternalProfile = {
        id: null,
        externalId: profile.id,
        email: profile.emails[0].value,
        type: EUserType.FACEBOOK,
      };
      await handleExternalProfile(facebookProfile, savedToken, done);
    }
  )
);

// Local auth
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done: Function) => {
      const trx = await Model.lock();
      try {
        // check if user exists
        const user = await UserModel.getByPrimaryKey({ id: null, email, type: EUserType.INTERNAL }, true, trx);
        if (!user) {
          return done(null, false, "Wrong email or password");
        }
        // check password
        const isMatch = await bcrypt.compare(password, user?.password);
        if (!isMatch) {
          return done(null, false, "Wrong email or password");
        }
        await Model.commit(trx);

        // login success
        const { password: pw, ...rest } = user;
        return done(null, { ...rest });
      } catch (error) {
        Model.rollback(trx, error);
        return done(null, false, error);
      }
    }
  )
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: JWT_SECRET,
};

// JWT login strategy
passport.use(
  new JwtStrategy(jwtOptions, async (payload: any, done: Function) => {
    const trx = await Model.lock();
    try {
      const user = UserModel.getByPrimaryKey({ id: payload.id, email: null, type: null }, false, trx);
      await Model.commit(trx);
      if (user) {
        return done(null, user);
      } else {
        return done("User not found", false);
      }
    } catch (error) {
      Model.rollback(trx, error);
      return done(error, false);
    }
  })
);

export const jwtAuth = passport.authenticate("jwt", { session: false });

passport.serializeUser((user: IUser, done: Function) => {
  return done(null, user);
});

passport.deserializeUser((user: IUser, done: Function) => {
  return done(null, { ...user, session: savedToken });
});
