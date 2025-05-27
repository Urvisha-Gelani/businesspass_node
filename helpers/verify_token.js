function verifyJwtToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
}
export default verifyJwtToken;
