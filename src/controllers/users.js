import UsersManager from "../dao/mysql/users.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import responses from "../utils/responses.js";

const getAll = async (req, res) => {
  const payload = await controllerHandlers.getResources(UsersManager, res);
  responses.successResponse(res, payload);
};

const handleUserState = async (req, res) => {
  const { id } = req.params;
  const { status, payload } = await UsersManager.handleUserState(id);
  res.json({ status, payload });
};
export default { getAll, handleUserState };
