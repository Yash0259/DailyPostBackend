require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const errorHandler = require("./src/middleware/errorMiddleware");
const postRoutes = require("./src/routes/postRoutes");

const app = express();

// Middleware
const allowedOrigins = [
  'https://your-frontend-url.vercel.app', // Replace with your actual Vercel frontend URL
  'http://localhost:3000', // If you also want to allow local development
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from the allowedOrigins list or when there's no origin (for testing, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(errorHandler);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Use post routes
app.use("/", postRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
