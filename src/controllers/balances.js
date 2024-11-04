import BalancesManager from "../dao/mysql/balances.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import responses from "../utils/responses.js";

const getAllBalances = async (req, res) => {
  const payload = await controllerHandlers.getResources(BalancesManager, res);
  responses.successResponse(res, payload);
};

export default { getAllBalances };
