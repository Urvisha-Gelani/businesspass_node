import KeyNumbers from "../models/key_numbers.model.js";
import keyNumbersCreated from "../services/key_numbers.service.js";
import logger from "../utils/logger.js";

export const createKeyNumber = async (req, res) => {
  try {
    const { ref_id } = req.params;
    const { key_number } = req.body;
    const user = req.user;
    console.log("req.user", req.user);
    const newKeyNumberData = await keyNumbersCreated({
      ref_id,
      key_number,
      user,
    });
    if (!newKeyNumberData) {
      return res.status(400).json({ message: "Key number creation failed" });
    }
    res.status(200).json(newKeyNumberData);
  } catch (error) {
    logger.error(`Error creating key number: ${error}`);
    res.status(500).json({ error: "Error creating key number" });
  }
};

export const getKeyNumbers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.per, 10) || 10;
    const skip = (page - 1) * limit;
    const { workspace } = req.user;
    const { id: workspace_id } = workspace;
    const filter = { workspace_id: workspace_id };
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }

    if (req.query.email) {
      filter.email = { $regex: req.query.email, $options: "i" };
    }

    if (req.query.offer_name) {
      filter.offer_name = { $regex: req.query.offer_name, $options: "i" };
    }

    if (req.query.price) {
      filter.price = { $regex: req.query.price, $options: "i" };
    }

    if (req.query.created_at) {
      filter.created_at = { $regex: req.query.created_at, $options: "i" };
    }
    if (req.query.issued_by) {
      filter.issued_by = { $regex: req.query.issued_by, $options: "i" };
    }
    if (req.query.key_number) {
      filter.key_number = { $regex: req.query.key_number, $options: "i" };
    }
    if (req.query.status) {
      filter.status = { $regex: req.query.status, $options: "i" };
    }
    const totalKeyNumbers = await KeyNumbers.countDocuments(filter);
    if (totalKeyNumbers === 0) {
      return res.status(200).json([]);
    }
    const keyNumbers = await KeyNumbers.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    res.set({
      "Total": totalKeyNumbers,
      "Total-Pages": Math.ceil(totalKeyNumbers / limit),
      "Current-Page": page,
      "Per-Page": limit,
    });
    
    res.status(200).json({ key_numbers: keyNumbers });
  } catch (error) {
    logger.error(`Error getting key numbers: ${error}`);
    res.status(500).json({ error: "Error getting key numbers" });
  }
};
