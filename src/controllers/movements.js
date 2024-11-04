import controllerHandlers from "../utils/controllerHandlers.js";
import responses from "../utils/responses.js";

const getMovementsByCostumerId = async (req, res) => {
  const { costumer_id } = req.params;
  const payload = await controllerHandlers.getResourcesById(costumer_id);
  responses.successResponse(res, payload);
};

export default { getMovementsByCostumerId };
