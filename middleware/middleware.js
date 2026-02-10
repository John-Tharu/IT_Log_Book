import { verifyToken } from "../model/model.js";

export const verifyJWT = (req, res, next) => {
  let token = req.cookies.access_token;

  if (!token) {
    req.user = null;
    return next();
  }

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decodedToken = verifyToken(token);
    req.user = decodedToken;
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    req.user = null;
  }

  next();
};
