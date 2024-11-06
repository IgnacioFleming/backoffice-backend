import MovementsManager from "../dao/mysql/movements.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import responses from "../utils/responses.js";

const getMovementsByCostumerId = async (req, res) => {
  const { costumer_id } = req.params;
  const { payload, error } = await controllerHandlers.getResourcesById(res, MovementsManager, costumer_id);
  if (error) return;
  responses.successResponse(res, payload);
};

export default { getMovementsByCostumerId };
