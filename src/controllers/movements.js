import MovementsManager from "../dao/mysql/movements.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import responses from "../utils/responses.js";

const getMovementsByCostumerId = async (req, res, next) => {
  try {
    const { costumer_id } = req.params;
    const { payload } = await controllerHandlers.getResourcesById(MovementsManager, costumer_id);
    responses.successResponse(res, payload);
  } catch (error) {
    next(error);
  }
};

export default { getMovementsByCostumerId };
