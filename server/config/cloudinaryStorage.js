const { CloudinaryStorage } = require(
  "multer-storage-cloudinary",
);

const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: "flowsync/avatars",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],
  },
});

module.exports = storage;