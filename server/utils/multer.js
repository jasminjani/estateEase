const multer = require("multer");
const path = require("path");

// multer configuration
exports.imgStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.imageFilter = function (req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();
  const mimetyp = file.mimetype;
  if (
    extension == ".jpg" ||
    extension == ".jpeg" ||
    extension == ".png" ||
    mimetyp == "image/png" ||
    mimetyp == "image/jpg" ||
    mimetyp == "image/jpeg"
  ) {
    return cb(null, true);
  }
  cb("error message img", true);
};
