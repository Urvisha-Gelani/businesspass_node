import { generateSlug, generateUniqueId } from "../helpers/index.js";
import Create_Keys_Published_Offers from "../models/create_keys_published_offer.model.js";
import Locations from "../models/locations.model.js";
import Offers from "../models/offer.model.js";
import logger from "../utils/logger.js";

export const OffersFindByDropdown = async (req, res) => {
  try {
    const { dropdown_ids } = req.body;

    const dropdown_offers = await Offers.find({ pricing_type: "keys" })
      .select({ id: 1, name: 1, _id: 0 })
      .lean();

    const offers = await Offers.find(
      { pricing_type: { $nin: ["keys"] } },
      {
        id: 1,
        name: 1,
        status: 1,
        price: 1,
        offer_type: 1,
        location_id: 1,
        _id: 0,
      }
    ).lean();

    const locationIds = [...new Set(offers.map((offer) => offer.location_id))];
    const locations = await Locations.find({ id: { $in: locationIds } })
      .select({ id: 1, name: 1, _id: 0 })
      .lean();

    const locationMap = Object.fromEntries(
      locations.map((loc) => [loc.id, loc.name])
    );

    let listing_offers = offers.map((offer) => ({
      ...offer,
      location_name: locationMap[offer.location_id] || null,
      listing: false,
    }));
    let slug = null;
    if (dropdown_ids && dropdown_ids.length > 0) {
      console.log("dropdown_ids", dropdown_ids);

      const publishedOffers = await Create_Keys_Published_Offers.find({
        dropdown_ids: { $all: dropdown_ids },
        $expr: { $eq: [{ $size: "$dropdown_ids" }, dropdown_ids.length] },
      });

      console.log("publishedOffers", publishedOffers);
      const generated_slug = publishedOffers.map((p) => p.slug).flat();
      console.log("slug", slug);
      slug = generated_slug.length > 0 ? generated_slug[0] : null;

      const publishedOfferIds = publishedOffers.map((p) => p.offers_ids).flat();

      console.log("publishedOfferIds", publishedOfferIds);
      console.log("listing_offers", listing_offers);

      listing_offers = listing_offers.map((offer) => ({
        ...offer,
        listing: publishedOfferIds.includes(offer.id),
      }));
    }

    console.log("slug*********************" + slug);
    res.status(200).json({
      dropdown_offers,
      listing_offers,
      slug,
    });
  } catch (error) {
    logger.error(`Error getting offers by dropdown: ${error}`);
    res.status(500).json({ error: "Error getting offers by dropdown" });
  }
};

export const CreatePublishOffersSlug = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { published_offer } = req.body;
    console.log("published_offer", published_offer);
    const { slug, offers_ids, dropdown_ids, keys } = published_offer;
    const user = req.user;
    const { id: user_id } = user;
    console.log("user_id", req.user);

    if (!offers_ids) {
      console.log("offer_ids", offers_ids);
      return res.status(422).json({ message: "Invalid request data" });
    }
    console.log("slug", slug);
    let updatePublishOffers;
    if (slug) {
      updatePublishOffers = await Create_Keys_Published_Offers.findOneAndUpdate(
        { slug: slug },
        { $set: { ...published_offer, user_id } },
        { new: true }
      );
    } else {
      const newSlug = await generateSlug();
      const nextId = await generateUniqueId("createKeysPublishedOfferId");
      updatePublishOffers = {
        id: nextId,
        slug: newSlug,
        user_id,
        offers_ids,
        dropdown_ids,
        keys,
      };
      const saveNewPublishedOffer = new Create_Keys_Published_Offers(
        updatePublishOffers
      );
      await saveNewPublishedOffer.save();
    }
    const { dropdown_ids: filteredDropdownIds, ...filteredPublishOffers } =
      updatePublishOffers.toObject?.() || updatePublishOffers;

    res.status(200).json(filteredPublishOffers);
  } catch (error) {
    logger.error(`Error getting conversion rates: ${error}`);
    res.status(500).json({ error: "Error getting conversion rates" });
  }
};
