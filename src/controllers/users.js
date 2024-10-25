import UsersManager from "../dao/mysql/users.js";

const getAll = async (req, res) => {
  const { status, error, payload } = await UsersManager.get();
  if (status === "error") return res.status(400).json({ status, error });
  res.json({ status, payload });
};

export default { getAll };
