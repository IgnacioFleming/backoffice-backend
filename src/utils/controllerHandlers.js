import CostumersManager from "../dao/mysql/costumers.js";
import responses, { statusTypes } from "./responses.js";

const validateBody = async (res, body, schema, method, id) => {
  try {
    const { success, data, ZodError } = schema.safeParse({ id: 1, ...body });
    if (!success) return responses.clientErrorResponse(res, ZodError);
    const { status, payload, error } = await CostumersManager[method](id || data, data);
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

const deleteResource = async (req, dao) => {
  const { id } = req.params;
  const { payload, error } = await dao.delete(id);
  if (error) return responses.clientErrorResponse(error);
  return payload;
};

export default {
  validateBody,
  costumersBodyHandler,
  getResources,
  getResourcesById,
  productsBodyHandler,
  deleteResource,
};
