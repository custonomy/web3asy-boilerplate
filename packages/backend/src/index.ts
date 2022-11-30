require("dotenv").config();

import { passport } from "./config/passport";
import bodyParser from "body-parser";
import { CLIENT_BASE_URL, knex, PORT } from "./utils/constants";
const cookieSession = require("cookie-session");
const session = require("express-session");
const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const mintRoute = require("./routes/txnRoute");
const app = express();
const morgan = require("morgan");

app.use(cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 }));
app.use(morgan("dev"));
app.use(passport.initialize());
app.use(passport.session());

knex
  .raw("SELECT 1")
  .then(() => {
    console.log("PostgreSQL connected at", process.env.RUNTIME_ENV);
  })
  .catch((e: unknown) => {
    console.log("PostgreSQL not connected");
    console.error(e);
  });

app.use(
  cors({
    origin: CLIENT_BASE_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
    cookie: { secure: true },
  })
);

app.use(bodyParser.json());
app.use("/api/auth", authRoute);
app.use("/api/mint", mintRoute);

app.listen(PORT, () => {
  console.log("Server is running!");
});
