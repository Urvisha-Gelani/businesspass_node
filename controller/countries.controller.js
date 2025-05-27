import countries from "world-countries";

// format the countries according to your required shape
const formattedCountries = countries.map((country, index) => ({
  id: index + 1,
  name: country.name.common,
  iso3: country.cca3,
  iso2: country.cca2,
  phone_code: country.idd?.root
    ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
    : "",
  latitude: country.latlng?.[0]?.toString() || "",
  longitude: country.latlng?.[1]?.toString() || "",
  emoji: country.flag,
  vat: (Math.random() * (25 - 15) + 15).toFixed(1), // you can add real VAT if you have a source or API for that
}));

export const getAllCountries = (req, res) => {
  res.json({ countries: formattedCountries });
};
