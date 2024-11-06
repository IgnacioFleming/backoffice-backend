import BalancesManager from "../dao/mysql/balances.js";
import controllerHandlers from "../utils/controllerHandlers.js";

const getAllBalances = async (req, res, next) => {
  try {
    await controllerHandlers.getResources(BalancesManager, res);
  } catch (error) {
    next(error);
  }
};

export default { getAllBalances };
