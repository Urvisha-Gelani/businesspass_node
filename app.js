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
import keyNumbersRouter from "./routes/key_numbers.routes.js";
import bookingsRouter from "./routes/bookings.routes.js";
import { apiRoutes } from "./constant/index.js";

const app = express();
app.use(corsMiddleware);
app.use(express.json());

app.use(apiRoutes, verifyUserRouter);
app.use(apiRoutes, adminRouter);
app.use(apiRoutes, exploreMembershipRouter);
app.use(`${apiRoutes}/admin`, userRouter);
app.use(`${apiRoutes}/users`, authRouter);
app.use(apiRoutes, countriesRouter);
app.use(apiRoutes, locationRouter);
app.use(apiRoutes, offersRouter);
app.use(apiRoutes, offerLocalesRouter);
app.use(apiRoutes, coWorkUserRouter);
app.use(apiRoutes, keyListingRouter);
app.use(apiRoutes, keyNumbersRouter);
app.use(apiRoutes, bookingsRouter);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(
  `${apiRoutes}/conversion_rates/default_conversion_rate`,
  conversionRates
);

app.use(errorHandler);

export default app;
