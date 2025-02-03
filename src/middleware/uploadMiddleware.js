const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the absolute path for the uploads directory in the root
const uploadDir = path.join(__dirname, "../uploads");

// Create the uploads folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ 'uploads/' directory created at the root of the project!");
}

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Correct path to the uploads directory in the root of the project
      cb(null, path.join(__dirname, "../../uploads")); // Pointing to 'Backend/uploads'
    },
    filename: (req, file, cb) => {
      // Unique filename
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

// Initialize multer with storage options
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Error: Images Only!"), false);
    }
  },
});

module.exports = upload;
