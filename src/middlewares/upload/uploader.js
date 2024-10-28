import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import config from "../../config/config.js";

const storage = multer.memoryStorage();
const uploader = multer({ storage });

cloudinary.config({
  cloud_name: config.uploads.cloudinary.cloud_name,
  api_key: config.uploads.cloudinary.api_key,
  api_secret: config.uploads.cloudinary.api_secret,
});

export const uploadMiddleware = async (req, res, next) => {
  uploader.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ status: "error", error: "There was an error while uploading the file." });
    }
    const imgName = req.file.originalname.split(".")[0] + Date.now().toString();
    const foldername = req.originalUrl.split("/")[2];

    const uploadOptions = {
      resource_type: "image",
      folder: foldername,
      public_id: imgName,
    };

    const imgUrlOptionns = {
      fetch_format: "webp",
      quality: "auto",
      gravity: "auto",
      crop: "auto",
      width: 600,
    };

    try {
      //upload the file to cloudinary
      const result = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
        if (err) return res.status(500).json({ status: "error", error: err });
        req.fileURL = cloudinary.url(result.public_id, imgUrlOptionns);
        next();
      });

      result.end(req.file.buffer);
    } catch (err) {
      res.status(500).send({ error: err });
    }
  });
};
