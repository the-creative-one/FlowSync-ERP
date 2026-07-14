const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/avatars");
  },

  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}${path.extname(
        file.originalname,
      )}`,
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG and WEBP files are allowed",
      ),
      false,
    );
  }
};

module.exports = multer({
  storage,
  fileFilter,
});