import CostumersManager from "../dao/mysql/costumers.js";
import { generateMockedCostumers } from "../mocks/costumers.js";
import { costumerSchema } from "../schemas/costumer.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import responses from "../utils/responses.js";

const getCostumers = async (req, res) => {
  const payload = await controllerHandlers.getResources(CostumersManager, res);
  responses.successResponse(res, payload);
};

const createCostumer = async (req, res) => {
  try {
    const body = controllerHandlers.costumersBodyHandler(req);
    const payload = await controllerHandlers.validateBody(res, body, costumerSchema, "create");
    responses.successResponse(res, payload);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

const updateCostumer = async (req, res) => {
  try {
    const { id } = req.params;
    const body = controllerHandlers.costumersBodyHandler(req);
    const costumer = await controllerHandlers.getResourcesById(CostumersManager, res, id);
    const updatedCostumer = { ...costumer, ...body };
    const payload = await controllerHandlers.validateBody(res, updatedCostumer, costumerSchema, "update", id);
    responses.successResponse(res, payload);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

const deleteCostumer = async (req, res) => {
  try {
    const payload = await controllerHandlers.deleteResource(req, CostumersManager);
    responses.successResponse(res, payload);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

const createMockedCostumers = async (req, res) => {
  try {
    const { quantity } = req.query;
    const mockedCostumers = await generateMockedCostumers(quantity);
    console.log(mockedCostumers);
    mockedCostumers.forEach(async (costumer) => {
      await CostumersManager.create(costumer);
    });
    responses.successResponse(res, "Mocked costumers created.");
  } catch (error) {}
};

export default { getCostumers, createCostumer, updateCostumer, deleteCostumer, createMockedCostumers };
