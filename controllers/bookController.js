import Book from "../models/Book.js";
import { success, error as sendError } from "../utils/response.js";
import logger from "../utils/logger.js";

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return success(
      res,
      { count: books.length, books },
      "Books fetched successfully",
    );
  } catch (err) {
    logger.error("getAllBooks error: %O", err);
    return sendError(res, 500, "Server error");
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return sendError(res, 404, "Book not found");
    }
    return success(res, { book }, "Book fetched successfully");
  } catch (err) {
    if (err.kind === "ObjectId") {
      return sendError(res, 400, "Invalid book ID format");
    }
    logger.error("getBookById error: %O", err);
    return sendError(res, 500, "Server error");
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Protected
const createBook = async (req, res) => {
  try {
    const { title, author, genre, price, inStock } = req.body;
    const book = await Book.create({ title, author, genre, price, inStock });
    return success(res, { book }, "Book created successfully", 201);
  } catch (err) {
    logger.error("createBook error: %O", err);
    return sendError(res, 500, "Server error");
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Protected
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return sendError(res, 404, "Book not found");
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    return success(res, { book: updatedBook }, "Book updated successfully");
  } catch (err) {
    if (err.kind === "ObjectId") {
      return sendError(res, 400, "Invalid book ID format");
    }
    logger.error("updateBook error: %O", err);
    return sendError(res, 500, "Server error");
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Protected
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return sendError(res, 404, "Book not found");
    }

    await book.deleteOne();
    return success(res, {}, "Book deleted successfully");
  } catch (err) {
    if (err.kind === "ObjectId") {
      return sendError(res, 400, "Invalid book ID format");
    }
    logger.error("deleteBook error: %O", err);
    return sendError(res, 500, "Server error");
  }
};

export { getAllBooks, getBookById, createBook, updateBook, deleteBook };
