const multer = require("multer");
exports.storage = {
  imagePath: "public/images",
  storageConfig: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    }
  })
};
