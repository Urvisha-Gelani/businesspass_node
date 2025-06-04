import Offers from "../models/offer.model.js";
import Offer_Locales from "../models/offer_locales.model.js";
import offerCreated from "../services/offers.service.js";
import logger from "../utils/logger.js";

export const createOffer = async (req, res) => {
  try {
    const { offer, location_id } = req.body;
    const { workspace } = req.user;

    if (!offer || !location_id) {
      return res
        .status(400)
        .json({ message: "Offer and location_id are required" });
    }

    const newOffer = await offerCreated({
      location_id,
      offer,
      workspace_id: workspace.id,
    });

    if (!newOffer) {
      return res.status(500).json({ message: "Offer creation failed" });
    }

    res.status(201).json(newOffer);
  } catch (error) {
    logger.error(`Error creating offer: ${error}`);
    res
      .status(500)
      .json({ error: "Internal server error while creating offer" });
  }
};

export const getOffers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.per, 10) || 10;
    const skip = (page - 1) * limit;
    const { workspace, location_id } = req.user;
    const { id: workspace_id } = workspace;

    const filter = { workspace_id: workspace_id };

    if (req.query.location_id || req.user.user_type === "cowork_user") {
      const locationId = Number(req.query.location_id || location_id);
      if (isNaN(locationId)) {
        return res.status(400).json({ message: "Invalid location_id" });
      }
      filter.location_id = locationId;
    }
    const queryFields = ["name", "offer_type", "price", "from_time", "status"];
    queryFields.forEach((key) => {
      const value = req.query[key];
      if (!value) return;

      filter[key] = { $regex: value, $options: "i" };
    });

    const totalOffers = await Offers.countDocuments(filter);
    if (totalOffers === 0) {
      return res.status(200).json({ offers: [], total: 0 });
    }

    const offersWithLocales = await Offers.find(filter, {
      _id: 0,
      created_at: 0,
      updated_at: 0,
    })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .then((offers) => {
        return Promise.all(
          offers.map(async (offer) => {
            const locales = await Offer_Locales.find(
              { offer_id: offer.id },
              { _id: 0, created_at: 0, updated_at: 0 }
            ).lean();

            return { ...offer, offer_locales: locales };
          })
        );
      });

    res.set({
      Total: totalOffers,
      "Total-Pages": Math.ceil(totalOffers / limit),
      "Current-Page": page,
      "Per-Page": limit,
    });

    res.status(200).json({
      offers: offersWithLocales,
    });
  } catch (error) {
    logger.error(`Error getting offers: ${error}`);
    res
      .status(500)
      .json({ error: "Internal server error while fetching offers" });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { offer } = req.body;

    if (!offer) {
      return res
        .status(400)
        .json({ message: "Offer data is required for update" });
    }

    const { offer_locales_attributes } = offer;
    const offer_locales = await Offer_Locales.findOneAndUpdate(
      { offer_id: id },
      { $set: offer_locales_attributes[0] },
      { new: true }
    );

    const updatedOffer = await Offers.findOneAndUpdate(
      { id },
      { $set: offer },
      { new: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    console.log("offer_locales", offer_locales);

    res.status(200).json({
      offer: {
        ...(updatedOffer.toObject?.() || updatedOffer),
        offer_locales,
      },
    });
  } catch (error) {
    logger.error(`Error updating offer: ${error}`);
    res
      .status(500)
      .json({ error: "Internal server error while updating offer" });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await Offers.findOneAndUpdate(
      { id },
      { status: "deleted" },
      { new: true }
    );

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting offer: ${error}`);
    res
      .status(500)
      .json({ error: "Internal server error while deleting offer" });
  }
};
