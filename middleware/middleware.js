import { verifyToken } from "../model/model.js";

export const verifyJWT = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decodedToken = verifyToken(token);
    req.user = decodedToken;
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    req.user = null;
    return next();
  }

  return next();
};
