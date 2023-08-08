require("dotenv").config();

import { passport } from "./config/passport";
import bodyParser from "body-parser";
import { CLIENT_BASE_URL, knex, PORT } from "./utils/constants";
import { createPayment } from "./stripe/payment";
import { stripeWebhook } from "./stripe/listener";
const cookieSession = require("cookie-session");
const session = require("express-session");
const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const mintRoute = require("./routes/mintRoute");
const orderMintRoute = require("./routes/orderMintRoute");
const app = express();
const morgan = require("morgan");

app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(morgan("dev"));
app.use(passport.initialize());
app.use(passport.session());

knex
  .raw("SELECT 1")
  .then(() => {
    console.log("PostgreSQL connected at", process.env.RUNTIME_ENV);
  })
  .catch((e: any) => {
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
    // store,
    cookie: { secure: true },
  })
);

app.use(bodyParser.json());
app.use("/api/auth", authRoute);
app.use("/api/mint", mintRoute);
app.use("/api/order", orderMintRoute);
app.use("/api/create-payment-intent", createPayment);

app.use(express.static("public"));
app.use(express.json());
app.post("/webhook", express.json({ type: "application/json" }), stripeWebhook);

app.listen(PORT, () => {
  console.log("Server is running!");
});

app.listen(4242, () => {
  console.log("Stripe is running on port 4242!");
});
