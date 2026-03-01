import { body, param } from "express-validator";

export const bookCreateRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("author").notEmpty().withMessage("Author is required"),
  body("genre").notEmpty().withMessage("Genre is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
];

export const bookIdParamRule = [
  param("id").isMongoId().withMessage("Invalid book ID"),
];

export const bookUpdateRules = [
  ...bookIdParamRule,
  body("price").optional().isNumeric().withMessage("Price must be a number"),
];
