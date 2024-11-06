import UsersManager from "../dao/mysql/users.js";
import controllerHandlers from "../utils/controllerHandlers.js";

const getAll = async (req, res) => {
  try {
    await controllerHandlers.getResources(UsersManager, res);
  } catch (error) {
    next(error);
  }
};

const handleUserState = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payload } = await UsersManager.handleUserState(id);
    res.json({ status, payload });
  } catch (error) {
    next(error);
  }
};
export default { getAll, handleUserState };
