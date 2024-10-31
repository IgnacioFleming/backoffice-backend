import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import config from "../../config/config.js";
import ProductsManager from "../../dao/mysql/products.js";
import CostumersManager from "../../dao/mysql/costumers.js";

const storage = multer.memoryStorage();
const uploader = multer({ storage });

cloudinary.config({
  cloud_name: config.uploads.cloudinary.cloud_name,
  api_key: config.uploads.cloudinary.api_key,
  api_secret: config.uploads.cloudinary.api_secret,
});

export const resources = {
  PRODUCTS: "products",
  COSTUMERS: "costumers",
};

export const uploadMiddleware = ({ deletePrevImg = false, resource } = {}) => {
  return (req, res, next) => {
    uploader.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(400).send({ status: "error", error: "There was an error while uploading the file." });
      }

      if (!req.file) return next();
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
        if (deletePrevImg) {
          if (!resource) {
            return res.status(400).json({ status: "error", error: "You didn´t declared what kind of resource you want to delete." });
          }
          const { id } = req.params;
          let service;
          switch (resource) {
            case resources.PRODUCTS:
              service = ProductsManager;
              break;
            case resources.COSTUMERS:
              service = CostumersManager;
              break;
          }
          const public_id = await service.getImgPublicIdById(id);
          if (public_id) {
            const result = await cloudinary.uploader.destroy(public_id);
          }
        }
        const result = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
          if (err) return res.status(500).json({ status: "error", error: err });
          req.fileURL = cloudinary.url(result.public_id, imgUrlOptionns);
          req.imgPublicId = result.public_id;
          next();
        });

        result.end(req.file.buffer);
      } catch (err) {
        res.status(500).send({ error: err });
      }
    });
  };
};
