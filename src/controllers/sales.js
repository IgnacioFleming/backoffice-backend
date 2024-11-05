import SalesManager from "../dao/mysql/sales.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import responses from "../utils/responses.js";

const getAll = async (req, res) => {
  const payload = await controllerHandlers.getResources(SalesManager, res);
  responses.successResponse(res, payload);
};

const create = async (req, res) => {
  try {
    const { body } = req;
    const payload = await controllerHandlers.validateBody(res, { sale_id: 1, ...body }, SalesManager, "create");
    responses.successResponse(res, payload);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

const deleteSale = async (req, res) => {
  try {
    const payload = await controllerHandlers.deleteResource(req, SalesManager);
    responses.successResponse(res, payload);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

export default {
  getAll,
  create,
  deleteSale,
};
