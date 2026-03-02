import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import bookRoutes from "./routes/bookRoutes.js";
import rateLimit from "express-rate-limit";

dotenv.config();

connectDB();

const app = express();

app.set("trust proxy", 1);

// rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // limit each IP to 100 requests
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});
app.use("/api/", apiLimiter);

app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Book Catalog API is running!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
