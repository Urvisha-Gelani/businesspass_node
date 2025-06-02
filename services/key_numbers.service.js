import { formattedCountries } from "../controller/countries.controller.js";
import { generateKeyNumber, generateUniqueId } from "../helpers/index.js";
import BookingUserDetails from "../models/booking_user_details.model.js";
import KeyNumbers from "../models/key_numbers.model.js";
import Offers from "../models/offer.model.js";
import Users from "../models/users.model.js";

const keyNumbersCreated = async (keyNumbersData) => {
  const { ref_id, key_number, user } = keyNumbersData;
  const { user_details } = key_number;
  console.log("user", user);
  const {
    first_name,
    last_name,
    workspace,
    preferred_language,
    payment_options,
    key_listing_locked,
    booking_gateway_locked,
    permissions,
    created_by_id,
  } = user;
  const { id: workspace_id } = workspace;
  const issued_by = `${first_name} ${last_name}`;
  const results = [];
  const offer = await Offers.findOne({ ref_id })
    .select({ id: 1, name: 1, _id: 0, price: 1, keys: 1 })
    .lean();
  const { id: offer_id, name: offer_name, price, keys } = offer;

  for (const userDetail of user_details) {
    const nextUniqueKeyNumber = await generateKeyNumber();
    const nextBookingUserId = await generateUniqueId("bookingUserId");
    const nextKeyNumberId = await generateUniqueId("keyNumbersId");
    const nextUserId = await generateUniqueId("userId");

    const { name, email, phone, country_id, published_offer_id } = userDetail;
    console.log(country_id, "country_id");
    const country = formattedCountries.find(
      (country) => country.id === country_id
    );
    console.log("country", country);
    // Save user details
    const newBookingUserDetails = new BookingUserDetails({
      id: nextBookingUserId,
      name,
      email,
      phone,
      country_id,
      offer_id,
      workspace_id,
      key_number: nextUniqueKeyNumber,
    });

    await newBookingUserDetails.save();
    console.log("newBookingUserDetails", newBookingUserDetails);
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
    // Save key number
    const newKeyNumberData = new KeyNumbers({
      id: nextKeyNumberId,
      name,
      email,
      phone,
      country_id,
      ref_id,
      key_number: nextUniqueKeyNumber,
      workspace_id,
      booking_user_detail_id: nextBookingUserId,
      offer_id,
      offer_name,
      price,
      keys,
      status: "active",
      issued_by,
      booking_user_detail_id: nextBookingUserId,
      published_offer_id,
    });
    console.log("newKeyNumberData", newKeyNumberData);
    await newKeyNumberData.save();

    results.push({
      key_number: newKeyNumberData,
      error: null,
    });
  }
  console.log("results", results);
  return results;
};

export default keyNumbersCreated;
