import CostumersManager from "../dao/mysql/costumers.js";
import responses, { statusTypes } from "./responses.js";

const validateBody = async (res, body, schema) => {
  try {
    const { success, data, ZodError } = schema.safeParse({ id: 1, ...body });
    if (!success) return responses.clientErrorResponse(res, ZodError);
    const { status, payload, error } = await CostumersManager.create(data);
    if (status === statusTypes.ERROR) return responses.clientErrorResponse(res, error);
    return payload;
  } catch (error) {
    throw error;
  }
};

const costumersBodyHandler = (req) => {
  const { body } = req;
  body.account_number = parseInt(body.account_number);
  req.fileURL && (body.logo = req.fileURL);
  req.imgPublicId && (body.logo_public_id = req.imgPublicId);
  return body;
};

const productsBodyHandler = (req) => {
  const { body } = req;
  body.price = parseFloat(body.price);
  body.stock = parseInt(body.stock);
  body.thumbnail = req.fileURL || body.thumbnail;
  req.imgPublicId && (body.thumbnail_public_id = req.imgPublicId);
  return body;
};

const getResources = async (dao, res) => {
  try {
    const { payload } = await dao.getAll();
    return payload;
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

const getResourcesById = async (dao, res, id) => {
  try {
    const { status, payload, error } = await dao.getById(id);
    if (status === statusTypes.ERROR) return responses.clientErrorResponse(res, error);
    return payload;
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

export default {
  validateBody,
  costumersBodyHandler,
  getResources,
  getResourcesById,
  productsBodyHandler,
};
