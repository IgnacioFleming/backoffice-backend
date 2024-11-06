import CostumersManager from "../dao/mysql/costumers.js";
import { generateMockedCostumers } from "../mocks/costumers.js";
import { costumerSchema } from "../schemas/costumer.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import responses from "../utils/responses.js";
import { modelMethods } from "../utils/utils.js";

const getCostumers = async (req, res) => {
  await controllerHandlers.getResources(CostumersManager, res);
};

const createCostumer = async (req, res) => {
  try {
    const body = controllerHandlers.costumersBodyHandler(req);
    const { validatedBody } = await controllerHandlers.validateBody(res, body, costumerSchema);
    await controllerHandlers.callModelAndRespond(res, validatedBody, CostumersManager, modelMethods.CREATE);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

const updateCostumer = async (req, res) => {
  try {
    const { id } = req.params;
    const body = controllerHandlers.costumersBodyHandler(req);
    const { error, payload } = await controllerHandlers.getResourcesById(res, CostumersManager, id);
    if (error) return;
    const updatedCostumer = { ...payload, ...body };
    console.log(body);
    const { validatedBody } = await controllerHandlers.validateBody(res, updatedCostumer, costumerSchema);
    await controllerHandlers.callModelAndRespond(res, validatedBody, CostumersManager, modelMethods.UPDATE, id);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

const deleteCostumer = async (req, res) => {
  try {
    await controllerHandlers.deleteResource(req, res, CostumersManager);
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
