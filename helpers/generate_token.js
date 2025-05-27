import crypto from "crypto";

function generateShortToken(length = 32) {
  return crypto.randomBytes(length / 2).toString("hex");
}

export default generateShortToken;


