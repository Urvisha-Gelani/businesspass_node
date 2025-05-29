import Explore_membership from "../models/explore_membership.model.js";
import exploreMemberCreated from "../services/explore_membership.service.js";

export const CreateExploreMemberships = async (req, res) => {
  try {
    const { explore_membership } = req.body;
    console.log("explore_membership", explore_membership);
    if (!explore_membership) {
      return res.status(400).json({ message: "User creation failed" });
    }
    const newExploreMembership = await exploreMemberCreated(explore_membership);
    if (!newExploreMembership) {
      return res.status(400).json({ message: "User creation failed" });
    }
    res.status(200).json(newExploreMembership);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

export const getExploreMemberships = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.per, 10) || 10;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }

    if (req.query.email) {
      filter.email = { $regex: req.query.email, $options: "i" };
    }

    if (req.query.explore_type) {
      filter.explore_type = { $regex: req.query.explore_type, $options: "i" };
    }

    const totalExploreMemberships = await Explore_membership.countDocuments(
      filter
    );
    if (totalExploreMemberships === 0) {
      return res.status(200).json([]);
    }
    const explore_memberships = await Explore_membership.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    res.set({
      "Total": totalExploreMemberships,
      "Total-Pages": Math.ceil(totalExploreMemberships / limit),
      "Current-Page": page,
      "Per-Page": limit,
    });
    if (!explore_memberships) {
      return res.status(400).json({ message: "User creation failed" });
    }
    console.log("explore_memberships", explore_memberships);
    res.status(200).json({ explore_memberships });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Error creating user" });
  }
};
