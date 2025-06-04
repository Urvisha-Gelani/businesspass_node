import moment from "moment-timezone";
import Bookings from "../models/bookings.model.js";
import bookingCreated from "../services/bookings.service.js";
import logger from "../utils/logger.js";
import BookingUserDetails from "../models/booking_user_details.model.js";
import Offers from "../models/offer.model.js";
import Locations from "../models/locations.model.js";
import { formateDate } from "../helpers/index.js";

export const createBooking = async (req, res) => {
  try {
    const user = req.user;
    const newBooking = await bookingCreated({ ...req.body, user });
    if (!newBooking) {
      return res.status(400).json({ message: "Booking creation failed" });
    }
    res.status(200).json({ message: "Booking created successfully" });
  } catch (error) {
    logger.error(`Error creating booking: ${error}`);
    res.status(500).json({ error: "Error creating booking" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.per, 10) || 10;
    const skip = (page - 1) * limit;
    const { workspace } = req.user;
    const { id: workspace_id } = workspace;
    const filter = { workspace_id: workspace_id };
    const queryFields = [
      "selected_date",
      "username",
      "ref_number",
      "booking_date",
      "amount",
      "status",
    ];

    queryFields.forEach((key) => {
      const value = req.query[key];
      if (!value) return;
      if (key === "selected_date" || key === "booking_date") {
        // Parse date to start and end of the day in UTC
        const dayStart = moment(value).startOf("day").toDate();
        const dayEnd = moment(value).endOf("day").toDate();
        filter[key] = { $gte: dayStart, $lte: dayEnd };
      } else {
        filter[key] = { $regex: value, $options: "i" };
      }
    });
    const totalBookings = await Bookings.countDocuments(filter);

    if (totalBookings === 0) {
      return res.status(200).json([]);
    }

    const bookings = await Bookings.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    if (!bookings) {
      return res.status(400).json({ message: "Booking creation failed" });
    }
    res.set({
      Total: totalBookings,
      "Total-Pages": Math.ceil(totalBookings / limit),
      "Current-Page": page,
      "Per-Page": limit,
    });
    const response = bookings.map((booking) => {
      const {
        selected_date,
        booking_date,
        offer_id,
        qty,
        workspace_id,
        created_at,
        updated_at,
        traffic,
        id,
        ...safeBooking
      } = booking.toObject();
      const formateSelectedDate = formateDate(selected_date);
      const formateBookingDate = formateDate(booking_date);
      return {
        id,
        selected_date: formateSelectedDate,
        booking_date: formateBookingDate,
        ...safeBooking,
      };
    });
    res.status(200).json({ bookings: response });
  } catch (error) {
    logger.error(`Error creating booking: ${error}`);
    res.status(500).json({ error: "Error creating booking" });
  }
};

export const getAllBookingUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.per, 10) || 10;
    const skip = (page - 1) * limit;
    const { workspace } = req.user;
    const { id: workspace_id } = workspace;
    const filter = {
      workspace_id,
      $or: [
        { key_number: { $exists: false } },
        { key_number: null },
        { key_number: "" }, // Optional: if key_number can be empty string
      ],
    };
    const queryFields = [
      "selected_date",
      "username",
      "ref_number",
      "booking_date",
      "amount",
      "status",
    ];
    queryFields.forEach((key) => {
      const value = req.query[key];
      if (!value) return;
      if (key === "selected_date") {
        // Parse date to start and end of the day in UTC
        const dayStart = moment(value).startOf("day").toDate();
        const dayEnd = moment(value).endOf("day").toDate();
        filter[key] = { $gte: dayStart, $lte: dayEnd };
      } else if (key === "username") {
        filter["name"] = { $regex: value, $options: "i" };
      } else {
        filter[key] = { $regex: value, $options: "i" };
      }
    });
    const totalUserBookings = await BookingUserDetails.countDocuments(filter);

    if (totalUserBookings === 0) {
      return res.status(200).json([]);
    }
    const bookingUsers = await BookingUserDetails.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    if (!bookingUsers) {
      return res.status(400).json({ message: "Booking creation failed" });
    }
    console.log("bookingUsers", bookingUsers);
    const response = await Promise.all(
      bookingUsers.map(async (bookingUser) => {
        const {
          id,
          name,
          email,
          booking_status,
          offer_id,
          selected_date,
          booking_date,
          user_booking_number,
          ref_number,
        } = bookingUser.toObject();

        const formateSelectedDate = formateDate(selected_date);
        const formateBookingDate = formateDate(booking_date);

        const offer = await Offers.findOne({ id: offer_id })
          .select({ name: 1, _id: 0, location_id: 1 })
          .lean();

        const offer_name = offer?.name || "";
        const location_id = offer?.location_id;

        const location = await Locations.findOne({ id: location_id })
          .select({ name: 1, _id: 0 })
          .lean();

        const location_name = location?.name || "";

        return {
          id,
          username: name,
          email,
          booking_status,
          offer_name,
          selected_date: formateSelectedDate,
          booking_date: formateBookingDate,
          user_booking_number,
          ref_number,
          location_name,
        };
      })
    );

    res.status(200).json({ bookings: response });
  } catch (error) {
    logger.error(`Error creating booking: ${error}`);
    res.status(500).json({ error: "Error creating booking" });
  }
};
