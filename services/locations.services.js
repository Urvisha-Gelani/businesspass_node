import { formattedCountries } from "../controller/countries.controller.js";
import { generateUniqueId } from "../helpers/index.js";
import Locations from "../models/locations.model.js";

const locationCreated = async (locationData) => {
  console.log("locationData", locationData);
  const nextUserId = await generateUniqueId("locationId");
  const bucketName = `${locationData.name}-${nextUserId}-${Math.random()
    .toString(36)
    .substring(2, 10)}`;
  const country = formattedCountries.find(
    (country) => country.id == locationData.country_id
  );
  console.log("country", country);
  console.log(formattedCountries, "formattedCountries");
  const location = new Locations({
    id: nextUserId,
    photo_urls: [],
    country_name: country ? country.name : null,
    bucket_name: bucketName,
    ...locationData,
    status: locationData.status === "" ? "active" : locationData.status,
  });
  console.log("locationData//////////////////////", locationData);
  console.log("location", location);
  await location.save();
  return location;
};

export default locationCreated;
