import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop(); // Get file extension
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
    //cb(null, file.originalname);
  },
});

export const upload = multer({
    storage
})