import MovementsManager from "../dao/mysql/movements.js";

const getMovementsByCostumerId = async (req, res) => {
  const { costumer_id } = req.params;
  const { status, error, payload } = await MovementsManager.getById(costumer_id);
  if (status === "error") return res.status(400).json({ status, error });
  res.json({ status, payload });
};

export default { getMovementsByCostumerId };
