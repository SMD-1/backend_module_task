import express from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { bookCreateRules, bookUpdateRules, bookIdParamRule } from "../validators/book.js";
import validate from "../middleware/validate.js";

const router = express.Router();

// Public routes
router.get("/", getAllBooks);
router.get("/:id", bookIdParamRule, validate, getBookById);

// Protected routes
router.post("/", authMiddleware, bookCreateRules, validate, createBook);
router.put("/:id", authMiddleware, bookUpdateRules, validate, updateBook);
router.delete("/:id", authMiddleware, bookIdParamRule, validate, deleteBook);

export default router;
