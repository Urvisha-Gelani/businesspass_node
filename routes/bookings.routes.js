import express from "express";
import authenticateToken from "../middlewares/auth.middleware.js";
import {
  createBooking,
  getAllBookings,
  getAllBookingUsers,
} from "../controller/bookings.controller.js";

const bookingsRouter = express.Router();
bookingsRouter.use(authenticateToken);
bookingsRouter.post("/bookings", createBooking);
bookingsRouter.get("/bookings", getAllBookings);
bookingsRouter.get("/booking_user_details", getAllBookingUsers);

export default bookingsRouter;
