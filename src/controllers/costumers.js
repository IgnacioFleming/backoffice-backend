import CostumersManager from "../dao/mysql/costumers.js";
import { generateMockedCostumers } from "../mocks/costumers.js";
import { costumerOptionalSchema, costumerSchema } from "../schemas/costumer.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import responses from "../utils/responses.js";
import { modelMethods } from "../utils/utils.js";

const getCostumers = async (req, res, next) => {
  try {
    await controllerHandlers.getResources(CostumersManager, res);
  } catch (error) {
    next(error);
  }
};

const createCostumer = async (req, res, next) => {
  try {
    const body = controllerHandlers.costumersBodyHandler(req);
    const { validatedBody } = await controllerHandlers.validateBody(body, costumerOptionalSchema);
    await controllerHandlers.callModelAndRespond(res, validatedBody, CostumersManager, modelMethods.CREATE);
  } catch (error) {
    next(error);
  }
};

const updateCostumer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = controllerHandlers.costumersBodyHandler(req);
    const { payload } = await controllerHandlers.getResourcesById(CostumersManager, id);
    const updatedCostumer = { ...payload, ...body };
    const { validatedBody } = await controllerHandlers.validateBody(updatedCostumer, costumerSchema);
    await controllerHandlers.callModelAndRespond(res, validatedBody, CostumersManager, modelMethods.UPDATE, id);
  } catch (error) {
    next(error);
  }
};

const deleteCostumer = async (req, res, next) => {
  try {
    await controllerHandlers.deleteResource(req, res, CostumersManager);
  } catch (error) {
    next(error);
  }
};

const createMockedCostumers = async (req, res, next) => {
  try {
    const { quantity } = req.query;
    const mockedCostumers = await generateMockedCostumers(quantity);
    mockedCostumers.forEach(async (costumer) => {
      await CostumersManager.create(costumer);
    });
    responses.successResponse(res, "Mocked costumers created.");
  } catch (error) {
    next(error);
  }
};

export default { getCostumers, createCostumer, updateCostumer, deleteCostumer, createMockedCostumers };
