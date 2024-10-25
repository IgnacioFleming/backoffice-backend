import BalancesManager from "../dao/mysql/balances.js";

const getAllBalances = async (req, res) => {
  const { status, payload, error } = await BalancesManager.getAll();
  if (status === "error") return res.json({ status, error });
  res.json({ status, payload });
};

export default { getAllBalances };
