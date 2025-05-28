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
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/v1/conversion_rates/default_conversion_rate", conversionRates);
// app.put("/:bucket_name/:key", (req, res) => {
//   const { bucket_name, key } = req.params;
//   const filePath = path.join(process.cwd(), "uploads", bucket_name, key);
//   res.download(filePath, (err) => {
//     if (err) {
//       console.error("File download error:", err);
//       res.status(404).send("File not found");
//     }
//   });
// });

app.use(errorHandler);

export default app;
