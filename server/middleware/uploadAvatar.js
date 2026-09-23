const multer = require("multer");

const storage = require("../config/cloudinaryStorage");

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG and WEBP files are allowed"), false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
});
