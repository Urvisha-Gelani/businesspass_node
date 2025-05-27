import { v4 as uuidv4 } from "uuid";
import { getLocalIP } from "../server.js";
import dotenv from "dotenv";
dotenv.config();

export const generateMockPresignedUrls = (photos = [], bucketName = "") => {
  return photos.map(() => {
    const fakeKey = uuidv4();
    const port = process.env.PORT || 3000;
    const localIP = getLocalIP();
    return `http://${localIP}:${port}/${bucketName}/${fakeKey}`;
  });
};
