import responses, { statusTypes } from "./responses.js";
import { destroyFile } from "./utils.js";

const validateBody = async (res, body = {}, schema) => {
  try {
    // if (!body) return sendNoBodyError(res);

    const { success, data, ZodError } = schema.safeParse({ id: 1, ...body });
    if (!success) {
      await destroyFile(body.thumbnail_public_id || body.logo_public_id);
      responses.clientErrorResponse(res, ZodError);
      return { error: ZodError };
    }
    return { validatedBody: data };
  } catch (error) {
    // if (!body) throw sendNoBodyError(res);
    await destroyFile(body.thumbnail_public_id || body.logo_public_id);
    throw error;
  }
};
const callModelAndRespond = async (res, data = {}, model, method, id) => {
  try {
    // if (!data) return sendNoBodyError(res);
    const { status, payload, error } = await model[method](id || data, data);
    if (status === statusTypes.ERROR) {
      await destroyFile(data.thumbnail_public_id || data.logo_public_id);
      responses.clientErrorResponse(res, error);
      return { error };
    }
    return responses.successResponse(res, payload);
  } catch (error) {
    // if (!data) throw sendNoBodyError(res);
    await destroyFile(data.thumbnail_public_id || data.logo_public_id);
    throw error;
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
    throw { error };
  }
};

const getResourcesById = async (res, dao, id) => {
  try {
    if (!id) {
      responses.clientErrorResponse(res, "Id must be provided.");

      return { error: "Id was not provided." };
    }
    const { payload, error } = await dao.getById(id);
    if (!payload) {
      responses.notFoundResponse(res);
      return { error: "Resource not Found" };
    }
    if (error) {
      responses.clientErrorResponse(res, error);
      return { error };
    }
    return { payload };
  } catch (error) {
    throw { error };
  }
};

const deleteResource = async (req, res, dao) => {
  try {
    const { id } = req.params;
    const { payload, error } = await dao.delete(id);
    if (error) return responses.clientErrorResponse(error);
    return responses.successResponse(res, payload);
  } catch (error) {
    throw { error };
  }
};

const sendNoBodyError = (res) => {
  const error = "There is no data on the request.";
  responses.clientErrorResponse(res, error);
  return { error };
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
