import { formattedCountries } from "../controller/countries.controller.js";
import {
  generateBookingRefNumber,
  generateUniqueId,
} from "../helpers/index.js";
import BookingUserDetails from "../models/booking_user_details.model.js";
import Bookings from "../models/bookings.model.js";
import Locations from "../models/locations.model.js";
import Offers from "../models/offer.model.js";
import Users from "../models/users.model.js";

const bookingCreated = async (bookingData) => {
  const { booking_offer, booking_user_detail, user } = bookingData;
  const {
    start_time,
    end_time,
    selected_date,
    qty,
    special_request,
    offer_id,
  } = booking_offer;
  const {
    first_name,
    last_name,
    email,
    workspace,
    preferred_language,
    payment_options,
    key_listing_locked,
    booking_gateway_locked,
    permissions,
    created_by_id,
  } = user;
  const { id: workspace_id } = workspace;
  let userName = `${first_name} ${last_name}`;
  let userEmail = email;
  const nextBookingId = await generateUniqueId("bookingId");
  const offerData = await Offers.findOne({ id: Number(offer_id) })
    .select({
      name: 1,
      _id: 0,
      pricing_type: 1,
      day_count: 1,
      location_id: 1,
      price: 1,
      status: 1,
      limited_per: 1,
      remaining_space: 1,
      ref_id: 1,
    })
    .lean();
  console.log("offerData", offerData);
  const {
    name: offer_name,
    pricing_type,
    day_count,
    location_id,
    price: offer_price,
    status: offer_status,
    limited_per,
    remaining_space,
    ref_id,
  } = offerData;
  if (pricing_type === "keys") {
    const user_details = booking_user_detail;
    const keyNumberData = {
      ref_id,
      keyNumber: user_details,
      user,
    };
    const newKeyNumberData = await keyNumbersCreated(keyNumberData);
    return newKeyNumberData;
  }
  const amount = Number(offer_price) * Number(qty);
  const location = await Locations.findOne({ id: location_id })
    .select({
      name: 1,
      _id: 0,
    })
    .lean();
  const { name: location_name } = location;
  const payUser = booking_user_detail.find((user) => user.payUser);
  if (payUser) {
    const { name, email: payUserEmail } = payUser;
    userName = name;
    userEmail = payUserEmail;
  }
  const nextUniqueRefNumber = await generateBookingRefNumber(offer_name, 18);
  const newBooking = new Bookings({
    id: nextBookingId,
    username: userName,
    email: userEmail,
    offer_id,
    workspace_id,
    offer_name,
    location_name,
    amount: amount.toFixed(2),
    start_time,
    end_time,
    selected_date,
    qty,
    special_request,
    status: "in_progress",
    booking_date: new Date(),
    ref_number: nextUniqueRefNumber,
    traffic: payUser ? "BG" : "MP",
  });
  for (let userDetails of booking_user_detail) {
    const nextBookingUserId = await generateUniqueId("bookingUserId");
    const nextUserId = await generateUniqueId("userId");
    const userBookingNumber = await generateBookingRefNumber(offer_name, 7);
    const userBookingRefNumber = await generateBookingRefNumber(offer_name, 16);

    const { name, email, phone, country_id } = userDetails;
    console.log(country_id, "country_id");
    const country = formattedCountries.find(
      (country) => country.id === country_id
    );
    console.log("country", country);
    const booking_user = new BookingUserDetails({
      id: nextBookingUserId,
      name,
      email,
      phone,
      country_id,
      booking_status: "in_progress",
      offer_id,
      workspace_id,
      booking_id: nextBookingId,
      user_booking_number: userBookingNumber,
      ref_number: userBookingRefNumber,
      selected_date,
      booking_date: new Date(),
    });
    console.log("booking_user", booking_user);
    await booking_user.save();
    const newUser = new Users({
      id: nextUserId,
      name,
      email,
      first_name: name,
      phone,
      country_id,
      permissions,
      country_name: country ? country.name : null,
      user_type: "guest",
      preferred_language,
      payment_options,
      key_listing_locked,
      booking_gateway_locked,
      status: "activated",
      workspace,
      created_by_id,
    });
    console.log("newUser", newUser);
    await newUser.save();
  }
  console.log("newBooking", newBooking);
  const updatedLimitedPer = Number(limited_per) - Number(qty);
  const updatedRemainingSpace = remaining_space - Number(qty);
  const offerStatus =
    updatedLimitedPer === 0 && updatedRemainingSpace === 0
      ? "limit_reached"
      : offer_status;
  console.log("updatedLimitedPer", updatedLimitedPer);
  console.log("updatedRemainingSpace", updatedRemainingSpace);

  await Offers.findOneAndUpdate(
    { id: Number(offer_id) },
    {
      $set: {
        limited_per: String(updatedLimitedPer),
        remaining_space: updatedRemainingSpace,
        status: offerStatus,
      },
    }
  );
  await newBooking.save();
  return newBooking;
};
export default bookingCreated;
