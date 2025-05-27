import generateJwtToken from "../helpers/generate_token.js";
import { generateUniqueId } from "../helpers/index.js";
import Users from "../models/users.model.js";
import logger from "../utils/logger.js";
import { sendVerificationEmail } from "./email.services.js";

const userCreated = async (userData) => {
  console.log("userData", userData);
  const nextUserId = await generateUniqueId("userId");
  const verify_token = generateJwtToken();
  console.log("verify_token", verify_token);
  const nextWorkspaceId = await generateUniqueId("workspaceId");
  const workspace = {
    id: nextWorkspaceId,
    name: userData.space_name || null,
    status: "active",
    website_url: userData.website_url || null,
  };
  const user = new Users({
    id: nextUserId,
    verify_token,
    workspace: userData.space_name ? workspace : null,
    ...userData,
    status: userData.status === "" ? "invited" : userData.status,
  });
  console.log("userData//////////////////////", userData);
  console.log("user", user);
  logger.info(`userCreated: ${user}`);
  sendVerificationEmail(user.email, verify_token);
  await user.save();
  return user;
};

export default userCreated;
