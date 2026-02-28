import Book from "../models/Book.js";

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Books fetched successfully",
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book fetched successfully", book });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid book ID format" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Protected
const createBook = async (req, res) => {
  try {
    const { title, author, genre, price, inStock } = req.body;

    if (!title || !author || !genre || price === undefined) {
      return res
        .status(400)
        .json({ message: "Please provide title, author, genre, and price" });
    }

    const book = await Book.create({ title, author, genre, price, inStock });
    res.status(201).json({ message: "Book created successfully", book });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Protected
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid book ID format" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Protected
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.deleteOne();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid book ID format" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { getAllBooks, getBookById, createBook, updateBook, deleteBook };
