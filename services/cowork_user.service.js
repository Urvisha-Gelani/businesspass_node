import { generateUniqueId } from "../helpers/index.js";
import generateShortToken from "../helpers/generate_token.js";
import Locations from "../models/locations.model.js";
import { formattedCountries } from "../controller/countries.controller.js";
import { sendVerificationEmail } from "./email.service.js";
import Users from "../models/users.model.js";

const coWorkUserCreated = async ({ requestedUser, cowork_user }) => {
  try {
    const {
      email,
      first_name,
      last_name,
      phone,
      country_id,
      permissions,
      location_id,
      name = null,
    } = cowork_user;

    const {
      created_by_id,
      booking_gateway_locked,
      workspace,
      key_listing_locked,
      payment_options,
      preferred_language,
    } = requestedUser;

    const nextUserId = await generateUniqueId("userId");
    const token = generateShortToken();

    const country = formattedCountries.find((c) => c.id === country_id);
    const country_name = country ? country.name : null;

    const location = await Locations.findOne({ id: location_id }).select(
      "name"
    );
    const location_name = location ? location.name : null;

    const newCoWorkUser = {
      id: nextUserId,
      email,
      name,
      first_name,
      last_name,
      phone,
      country_id,
      permissions,
      location_id,
      booking_gateway_locked,
      workspace,
      key_listing_locked,
      payment_options,
      preferred_language,
      verify_token: token,
      country_name,
      location_name,
      created_by_id,
      user_type: "cowork_user",
      status: "invited",
    };

    const coWorkUserData = new Users(newCoWorkUser);
    await coWorkUserData.save();

    sendVerificationEmail(email, token);

    return coWorkUserData;
  } catch (error) {
    console.error("Error in coWorkUserCreated:", error);
    throw new Error("Failed to create cowork user");
  }
};

export default coWorkUserCreated;
