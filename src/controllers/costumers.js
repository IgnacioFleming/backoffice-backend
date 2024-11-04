import CostumersManager from "../dao/mysql/costumers.js";
import { generateMockedCostumers } from "../mocks/costumers.js";
import { costumerOptionalSchema, costumerSchema } from "../schemas/costumer.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import responses from "../utils/responses.js";

const getCostumers = async (req, res) => {
  const payload = await controllerHandlers.getResources(CostumersManager, res);
  responses.successResponse(res, payload);
};

const createCostumer = async (req, res) => {
  try {
    const body = controllerHandlers.costumersBodyHandler(req);
    const payload = await controllerHandlers.validateBody(req, res, body, costumerSchema);
    responses.successResponse(res, payload);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

const updateCostumer = async (req, res) => {
  try {
    const { id } = req.params;
    const body = controllerHandlers.costumersBodyHandler(req);
    const costumer = await CostumersManager.getById(id);
    if (!costumer) return responses.clientErrorResponse(res, "Costumer does not exist.");
    const updatedCostumer = { ...costumer, ...body };
    updatedCostumer.logo_public_id ?? delete updatedCostumer.logo_public_id;
    const payload = await controllerHandlers.validateBody(req, res, body, costumerOptionalSchema);
    responses.successResponse(res, payload);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

const deleteCostumer = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = await CostumersManager.delete(id);
    responses.successResponse(res, payload);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

const createMockedCostumers = async (req, res) => {
  try {
    const { quantity } = req.query;
    const mockedCostumers = await generateMockedCostumers(quantity);
    mockedCostumers.forEach(async (costumer) => {
      await CostumersManager.create(costumer);
    });
    responses.successResponse(res, "Mocked costumers created.");
  } catch (error) {}
};

export default { getCostumers, createCostumer, updateCostumer, deleteCostumer, createMockedCostumers };
