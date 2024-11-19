import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

export const createHash = async (password) => bcrypt.hash(password, bcrypt.genSaltSync(10));

export const isValidPassword = async (password, user) => bcrypt.compare(password, user.password);

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["sessionCookie"];
  }
  return token;
};

export const tokenExtractor = (req) => {
  let token = null;
  if (req && req.params.token) {
    token = req.params.token;
  }
  return token;
};

export const destroyFile = async (public_id) => public_id && (await cloudinary.uploader.destroy(public_id));

export const modelMethods = {
  GET: "get",
  GET_BY_ID: "getById",
  UPDATE: "update",
  CREATE: "create",
  DELETE: "delete",
};

export const defaultImages = {
  defaultCostumerImgUrl: "https://res.cloudinary.com/dah7yxmc5/image/upload/v1731957076/Business-manager/cliente-default_jdpzvx.webp",
  defaultProductImgUrl: "https://res.cloudinary.com/dah7yxmc5/image/upload/v1731957076/Business-manager/def_product_rertc4.webp",
};
