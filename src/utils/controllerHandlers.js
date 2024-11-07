import CustomError from "./errors/customError.js";
import { createCustomError } from "./errors/errorFactory.js";
import { ERRORS } from "./errors/errorTypes.js";
import responses, { statusTypes } from "./responses.js";
import { destroyFile } from "./utils.js";

const validateBody = async (res, body = {}, schema) => {
  console.log(body);
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
    throw createCustomError(ERRORS.UNHANDLED);
  }
};
const callModelAndRespond = async (res, data = {}, model, method, id) => {
  try {
    const { status, payload, error } = await model[method](id || data, data);
    console.log(status);
    if (status === statusTypes.ERROR || error) {
      await destroyFile(data.thumbnail_public_id || data.logo_public_id);
      throw createCustomError(ERRORS.DATABASE);
    }
    return responses.successResponse(res, payload);
  } catch (error) {
    if (error instanceof CustomError) throw error;
    await destroyFile(body.thumbnail_public_id || body.logo_public_id);
    throw createCustomError(ERRORS.UNHANDLED);
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
  body.price = parseFloat(body.price);
  body.stock = parseInt(body.stock);
  body.thumbnail = req.fileURL || body.thumbnail;
  req.imgPublicId && (body.thumbnail_public_id = req.imgPublicId);
  return body;
};

const getResources = async (dao, res) => {
  try {
    const { payload } = await dao.getAll();
    return responses.successResponse(res, payload);
  } catch (error) {
    throw createCustomError(ERRORS.UNHANDLED);
  }
};

const getResourcesById = async (res, dao, id) => {
  try {
    if (!id) throw createCustomError(ERRORS.NO_ID);
    const { payload, error } = await dao.getById(id);
    if (error) throw createCustomError(ERRORS.NOT_FOUND);
    return { payload };
  } catch (error) {
    if (error instanceof CustomError) throw error;
    await destroyFile(body.thumbnail_public_id || body.logo_public_id);
    throw createCustomError(ERRORS.UNHANDLED);
  }
};

const deleteResource = async (req, res, dao) => {
  try {
    const { id } = req.params;
    const { payload, error } = await dao.delete(id);
    if (error) throw createCustomError(ERRORS.NOT_FOUND);
    return responses.successResponse(res, payload);
  } catch (error) {
    if (error instanceof CustomError) throw error;
    await destroyFile(body.thumbnail_public_id || body.logo_public_id);
    throw createCustomError(ERRORS.UNHANDLED);
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
};
