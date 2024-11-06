import SalesManager from "../dao/mysql/sales.js";
import { saleSchema } from "../schemas/sale.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import responses from "../utils/responses.js";
import { modelMethods } from "../utils/utils.js";

const getAll = async (req, res) => {
  await controllerHandlers.getResources(SalesManager, res);
};

const create = async (req, res) => {
  try {
    const { body } = req;
    const { validatedBody } = await controllerHandlers.validateBody(res, body, saleSchema);
    await controllerHandlers.callModelAndRespond(res, { sale_id: 1, ...validatedBody }, SalesManager, modelMethods.CREATE);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

const deleteSale = async (req, res) => {
  try {
    await controllerHandlers.deleteResource(req, SalesManager);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

export default {
  getAll,
  create,
  deleteSale,
};
