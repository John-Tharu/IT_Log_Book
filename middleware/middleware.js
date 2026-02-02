import { verifyToken } from "../model/model.js";

export const verifyJWT = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    req.use = null;
    return next();
  }

  try {
    const decodedToken = verifyToken(token);
    req.user = decodedToken;
    // console.log(req.user);
  } catch (error) {
    req.user = null;
  }

  return next();
};
