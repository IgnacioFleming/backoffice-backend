import SalesManager from "../dao/mysql/sales.js";
import { saleSchema } from "../schemas/sale.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import { modelMethods } from "../utils/utils.js";

const getAll = async (req, res, next) => {
  try {
    await controllerHandlers.getResources(SalesManager, res);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { body } = req;
    const { validatedBody } = await controllerHandlers.validateBody(res, body, saleSchema);
    await controllerHandlers.callModelAndRespond(res, { sale_id: 1, ...validatedBody }, SalesManager, modelMethods.CREATE);
  } catch (error) {
    next(error);
  }
};

const deleteSale = async (req, res, next) => {
  try {
    await controllerHandlers.deleteResource(req, res, SalesManager);
  } catch (error) {
    next(error);
  }
};

export default {
  getAll,
  create,
  deleteSale,
};
