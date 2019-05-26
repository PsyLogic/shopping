const multer = require("multer");
const { path } = require("../utils/helpers");
exports.storage = {
  imagePath: "public/images/upload",
  storageConfig: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images/upload");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    }
  }),
  invoicePath: path + "/storage/invoices/"
};
