import express from "express";
import corsMiddleware from "./config/cors.config.js";
import errorHandler from "./middlewares/error.middleware.js";
import userRouter from "./routes/users.routes.js";
import authRouter from "./routes/auth.routes.js";
import countriesRouter from "./routes/countries.routes.js";
import locationRouter from "./routes/locations.routes.js";
import path from "path";
import { conversionRates } from "./controller/locations_offers.controller.js";
import verifyUserRouter from "./routes/verify_user.routes.js";
import exploreMembershipRouter from "./routes/explore_membership.routes.js";
import adminRouter from "./routes/admin.routes.js";
import offersRouter from "./routes/offers.routes.js";
import offerLocalesRouter from "./routes/offer_locales.routes.js";
import keyListingRouter from "./routes/key_listing.routes.js";
import coWorkUserRouter from "./routes/cowork_user.routes.js";

const app = express();
app.use(corsMiddleware);
app.use(express.json());

app.use("/api/v1", verifyUserRouter);
app.use("/api/v1", adminRouter);
app.use("/api/v1", exploreMembershipRouter);
app.use("/api/v1/admin", userRouter);
app.use("/api/v1/users", authRouter);
app.use("/api/v1", countriesRouter);
app.use("/api/v1", locationRouter);
app.use("/api/v1", offersRouter);
app.use("/api/v1", offerLocalesRouter);
app.use("/api/v1", coWorkUserRouter);
app.use("/api/v1", keyListingRouter);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/v1/conversion_rates/default_conversion_rate", conversionRates);

app.use(errorHandler);

export default app;
