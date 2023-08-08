import {
  USER_TYPE,
  SECRET,
  GOOGLE_USER_PROFILE_URL,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_BASE_URL,
  // TWITTER_API_KEY,
  // TWITTER_API_KEY_SECRET,
} from "../utils/constants";
import UserModel from "../models/UserModel";
import { handleExternalProfile } from "../utils/helpers";
import { IExternalProfile } from "../utils/types";
import Model from "../models/Model";

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
// const TwitterStrategy = require("passport-twitter").Strategy;
// const TwitterTokenStrategy = require('passport-twitter-token');

// const TwitterStrategy = require("passport-twitter-oauth2");
export const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt,
  LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");

let savedToken = "";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${REDIRECT_BASE_URL}/api/auth/google/callback`,
      userProfileURL: GOOGLE_USER_PROFILE_URL,
    },
    async function (accessToken: string, refreshToken: string, otherTokenDetails: any, profile: any, done: Function) {
      // savedToken = `${USER_TYPE.GOOGLE}:${otherTokenDetails.id_token}`;
      savedToken = `${USER_TYPE.GOOGLE}:${accessToken}`;
      const googleProfile = {
        id: null,
        externalId: profile.id,
        email: profile.emails[0].value,
        type: USER_TYPE.GOOGLE,
      };
      await handleExternalProfile(googleProfile, savedToken, done);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: `${REDIRECT_BASE_URL}/api/auth/facebook/callback`,
      profileFields: ["id", "displayName", "emails"],
    },
    async function (accessToken: string, refreshToken: string, otherTokenDetails: any, profile: any, done: Function) {
      savedToken = `${USER_TYPE.FACEBOOK}:${accessToken}`;
      const facebookProfile: IExternalProfile = {
        id: null,
        externalId: profile.id,
        email: profile.emails[0].value,
        type: USER_TYPE.FACEBOOK,
      };
      await handleExternalProfile(facebookProfile, savedToken, done);
    }
  )
);

// TODO: TWITTER
// passport.use(
//   new TwitterStrategy(
//     {
//       clientID: TWITTER_API_KEY,
//       clientSecret: TWITTER_API_KEY_SECRET,
//       consumerKey: TWITTER_API_KEY,
//       consumerSecret: TWITTER_API_KEY_SECRET,
//       callbackURL: "/api/auth/twitter/callback",
//       // userProfileURL  : 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
//       // passReqToCallback : true,
//       includeEmail: true,
//     },
//     async function (token: string, tokenSecret: string,  otherTokenDetails: any, profile: any, done: Function) {
//       console.log({ token, tokenSecret, otherTokenDetails, profile });
//       // savedToken = `${USER_TYPE.TWITTER}:${accessToken}`;
//       // const facebookProfile: IExternalProfile = {
//       //   id: null,
//       //   externalId: profile.id,
//       //   email: profile.emails[0].value,
//       //   type: USER_TYPE.FACEBOOK,
//       // };
//       // console.log({ accessToken });
//       // await handleExternalProfile(facebookProfile, savedToken, done);
//     }
//   )
// );

passport.serializeUser((user: any, done: Function) => {
  return done(null, user);
});

passport.deserializeUser((user: any, done: Function) => {
  return done(null, { ...user, session: savedToken });
});

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
        const user: any = await UserModel.getByPrimaryKey({ id: null, email, type: USER_TYPE.INTERNAL }, true, trx);
        // const user: any = await UserModel.getByPrimaryKey({ id: null, email, type: USER_TYPE.INTERNAL, externalId: null }, true);
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

// Setting JWT strategy options
const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: SECRET,
};

// Setting up JWT login strategy
passport.use(
  new JwtStrategy(jwtOptions, async (payload: any, done: Function) => {
    const trx = await Model.lock();
    try {
      const user = UserModel.getByPrimaryKey({ id: payload.id, email: null, type: null }, false, trx);
      // const user = UserModel.getByPrimaryKey({ id: payload.id, email: null, type: null, externalId: null });
      if (user) {
        return done(null, user);
      } else {
        return done("User not found", false);
      }

      await Model.commit(trx);
    } catch (error) {
      Model.rollback(trx, error);
      return done(error, false);
    }
  })
);

export const jwtAuth = passport.authenticate("jwt", { session: false });
