import jwt from "jsonwebtoken";
import { error as sendError } from "../utils/response.js";
import logger from "../utils/logger.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return sendError(res, 401, "Unauthorized: No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn("JWT verify failed: %s", err.message);
    return sendError(res, 403, "Invalid or expired token");
  }
};

export default authMiddleware;
