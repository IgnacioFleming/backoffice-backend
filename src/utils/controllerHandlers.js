import CustomError from "./errors/customError.js";
import { createCustomError } from "./errors/errorFactory.js";
import { ERRORS } from "./errors/errorTypes.js";
import responses, { statusTypes } from "./responses.js";
import { destroyFile } from "./utils.js";

const validateBody = async (body = {}, schema) => {
  try {
    const { success, data, error } = schema.safeParse({ id: 1, ...body });
    if (!success) {
      await destroyFile(body.thumbnail_public_id || body.logo_public_id);
      throw createCustomError(ERRORS.INVALID_BODY, error);
    }
    return { validatedBody: data };
  } catch (error) {
    if (error instanceof CustomError) throw error;
    await destroyFile(body.thumbnail_public_id || body.logo_public_id);
    throw createCustomError(ERRORS.UNHANDLED, JSON.stringify(error));
  }
};
const callModelAndRespond = async (res, data = {}, model, method, id) => {
  try {
    const { payload } = await model[method](id || data, data);
    if (!payload) {
      await destroyFile(data.thumbnail_public_id || data.logo_public_id);
      throw createCustomError(ERRORS.NOT_FOUND);
    }
    return responses.successResponse(res, payload);
  } catch (error) {
    if (error instanceof CustomError) throw error;
    await destroyFile(body.thumbnail_public_id || body.logo_public_id);
    throw createCustomError(ERRORS.UNHANDLED, JSON.stringify(error));
  }
};

const costumersBodyHandler = (req) => {
  const { body } = req;
  if (body.account_number) body.account_number = parseInt(body.account_number);
  req.fileURL && (body.logo = req.fileURL);
  req.imgPublicId && (body.logo_public_id = req.imgPublicId);
  return body;
};

const productsBodyHandler = (req) => {
  const { body } = req;
  body.price = Number(body.price);
  body.stock = parseInt(body.stock);
  body.cost = Number(body.cost);
  req.fileURL && (body.thumbnail = req.fileURL);
  req.imgPublicId && (body.thumbnail_public_id = req.imgPublicId);
  console.log(body);
  return body;
};

const salesBodyHandler = (req) => {
  const { body } = req;
  const { products } = body;
  console.log(products);
  const parsedBody = {};
  parsedBody.product_id = parseInt(products.product_id);
  parsedBody.quantity = parseInt(products.quantity);
  parsedBody.amount = parseInt(products.amount);
  body.products = [parsedBody];
  return body;
};

const getResources = async (dao, res) => {
  try {
    const { payload } = await dao.getAll();
    return responses.successResponse(res, payload);
  } catch (error) {
    throw createCustomError(ERRORS.UNHANDLED, JSON.stringify(error));
  }
};

const getResourcesById = async (dao, id) => {
  try {
    if (!id) throw createCustomError(ERRORS.NO_ID);
    const { payload } = await dao.getById(id);
    if (!payload) throw createCustomError(ERRORS.NOT_FOUND);
    return { payload };
  } catch (error) {
    if (error instanceof CustomError) throw error;
    await destroyFile(body.thumbnail_public_id || body.logo_public_id);
    throw createCustomError(ERRORS.UNHANDLED, JSON.stringify(error));
  }
};

const deleteResource = async (req, res, dao) => {
  try {
    const { id } = req.params;
    const { payload } = await dao.delete(id);
    if (payload.affectedRows === 0) throw createCustomError(ERRORS.NOT_FOUND);
    return responses.successResponse(res, payload);
  } catch (error) {
    if (error instanceof CustomError) throw error;
    await destroyFile(body.thumbnail_public_id || body.logo_public_id);
    throw createCustomError(ERRORS.UNHANDLED, JSON.stringify(error));
  }
};

export default {
  validateBody,
  costumersBodyHandler,
  getResources,
  getResourcesById,
  productsBodyHandler,
  deleteResource,
  callModelAndRespond,
  salesBodyHandler,
};
