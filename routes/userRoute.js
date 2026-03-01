import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { registerRules, loginRules } from "../validators/user.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post("/register", registerRules, validate, registerUser);
router.post("/login", loginRules, validate, loginUser);

export default router;
