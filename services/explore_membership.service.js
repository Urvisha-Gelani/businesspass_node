import { generateUniqueId } from "../helpers/index.js";
import Explore_membership from "../models/explore_membership.model.js";

import logger from "../utils/logger.js";

const exploreMemberCreated = async (membershipData) => {
  console.log("membershipData", membershipData);
  const nextUserId = await generateUniqueId("exploreMembershipId");

  const exploreMember = new Explore_membership({
    id: nextUserId,
    ...membershipData,
  });
  console.log("exploreMember//////////////////////", exploreMember);
  await exploreMember.save();
  return exploreMember;
};

export default exploreMemberCreated;
