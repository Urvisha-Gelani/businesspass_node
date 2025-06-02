import { generateSlug, generateUniqueId } from "../helpers/index.js";
import Create_Keys_Published_Offers from "../models/create_keys_published_offer.model.js";
import Locations from "../models/locations.model.js";
import Offers from "../models/offer.model.js";
import logger from "../utils/logger.js";

export const OffersFindByDropdown = async (req, res) => {
  try {
    const { dropdown_ids } = req.body;
    const { workspace } = req.user;
    const { id: workspace_id } = workspace;

    const dropdown_offers = await Offers.find({
      pricing_type: "keys",
      status: { $nin: ["deleted", "expired", "limit_reached"] },
      workspace_id,
    })
      .select({ id: 1, name: 1, _id: 0 })
      .lean();

    const offers = await Offers.find(
      {
        pricing_type: { $nin: ["keys"] },
        status: { $nin: ["deleted", "expired", "limit_reached"] },
        workspace_id,
      },
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
        workspace_id,
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
    const { id: user_id, workspace } = user;
    const { id: workspace_id } = workspace;
    console.log("user_id", req.user);
    if ((!dropdown_ids || dropdown_ids.length == 0) && keys) {
      return res.status(422).json({ message: "Dropdown_ids are required" });
    }

    if (!offers_ids || offers_ids.length == 0) {
      console.log("offer_ids", offers_ids);
      return res.status(422).json({ message: "Offer_ids are required" });
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
        workspace_id,
      };
      const saveNewPublishedOffer = new Create_Keys_Published_Offers(
        updatePublishOffers
      );
      await saveNewPublishedOffer.save();
    }
    const {
      dropdown_ids: filteredDropdownIds,
      workspace_id: filteredWorkspaceId,
      ...filteredPublishOffers
    } = updatePublishOffers.toObject?.() || updatePublishOffers;

    res.status(200).json(filteredPublishOffers);
  } catch (error) {
    logger.error(`Error getting conversion rates: ${error}`);
    res.status(500).json({ error: "Error getting conversion rates" });
  }
};

export const getPublishedOffers = async (req, res) => {
  try {
    const user = req.user;
    const { workspace } = user;
    const { id: workspace_id } = workspace;
    const publishedOffers = await Create_Keys_Published_Offers.findOne({
      keys: false,
      workspace_id,
    });
    console.log("publishedOffers", publishedOffers);
    if (!publishedOffers) {
      return res.status(200).json({});
    }
    const {
      dropdown_ids,
      created_at,
      updated_at,
      workspace_id: filteredWorkspaceId,
      ...filteredPublishOffers
    } = publishedOffers.toObject?.() || publishedOffers;
    res.status(200).json(filteredPublishOffers);
  } catch (error) {
    logger.error(`Error getting conversion rates: ${error}`);
    res.status(500).json({ error: "Error getting conversion rates" });
  }
};

export const getPublishedOffersUrls = async (req, res) => {
  try {
    const { ref_id } = req.params;
    const { id: workspace_id } = req.user.workspace;

    const keysOffers = await Offers.findOne({ ref_id })
      .select({ id: 1, _id: 0 })
      .lean();

    if (!keysOffers) {
      return res.status(404).json({ error: "Referenced offer not found" });
    }

    const { id } = keysOffers;

    const publishOffersUrls = await Create_Keys_Published_Offers.find({
      $or: [{ dropdown_ids: id }, { keys: false }],
      workspace_id,
    }).lean();
    let error = "";
    if (!publishOffersUrls || publishOffersUrls.length === 0) {
      error = "please publish offers";
    }
    console.log("publishOffersUrls", publishOffersUrls);

    const allOfferIds = [
      ...new Set(publishOffersUrls.flatMap((item) => item.offers_ids)),
    ];

    console.log("allOfferIds", allOfferIds);

    const offers = await Offers.find({ id: { $in: allOfferIds } })
      .select({ id: 1, name: 1, _id: 0 })
      .lean();

    console.log("offers", offers);

    const offerIdNameMap = Object.fromEntries(
      offers.map((offer) => [offer.id, offer.name])
    );

    let selectedSet = false;

    const response = publishOffersUrls.map((item) => {
      const offerNames = item.offers_ids.map((id) => offerIdNameMap[id] || "");

      let isSelected = false;

      if (
        !selectedSet &&
        item.dropdown_ids.length === 1 &&
        item.dropdown_ids[0] === id
      ) {
        isSelected = true;
        selectedSet = true;
      }

      return {
        published_offer_id: item.id,
        url: `http://localhost:3003/online-gateway/${item.slug}`,
        selected: isSelected,
        prepend: isSelected
          ? "(Default offer)"
          : !item.keys
          ? "(Booking gateway)"
          : item.offers_ids.length,
        offers: offerNames.join(", "),
      };
    });

    if (!selectedSet) {
      const fallbackIndex = response.findIndex(
        (item, i) => publishOffersUrls[i].keys === false
      );
      if (fallbackIndex !== -1) {
        response[fallbackIndex].selected = true;
        response[fallbackIndex].prepend = "(Booking gateway)";
      }
    }

    response.sort((a, b) => (b.selected === true) - (a.selected === true));

    console.log("response", response);

    return res.status(200).json({ data: response, error });
  } catch (error) {
    logger.error(`Error getting published offers: ${error}`);
    return res.status(500).json({ error: "Error getting published offers" });
  }
};
