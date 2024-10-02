import CostumersManager from "../dao/mysql/costumers.js";

const getCostumers = async (req, res) => {
  const costumers = await CostumersManager.getAll();
  res.json({ status: "success", payload: costumers });
};

const createCostumer = async (req, res) => {
  try {
    const { body } = req;
    const newCostumer = await CostumersManager.create(body);
    console.log(newCostumer);
    if (newCostumer?.error) return res.status(400).send({ status: "error", error: newCostumer.error });
    res.json({ status: "success", payload: newCostumer });
  } catch (error) {
    res.status(500).send({ status: "error", error });
  }
};

const updateCostumer = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const updateCostumer = await CostumersManager.update(id, body);
    if (updateCostumer?.error) return res.status(400).send({ status: "error", error: updateCostumer.error });
    res.json({ status: "success", payload: updateCostumer });
  } catch (error) {
    res.status(500).send({ status: "error", error });
  }
};

const deleteCostumer = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteCostumer = await CostumersManager.delete(id);
    if (deleteCostumer?.error) return res.status(400).send({ status: "error", error: deleteCostumer.error });
    res.json({ status: "success", payload: deleteCostumer });
  } catch (error) {
    res.status(500).send({ status: "error", error });
  }
};

export default { getCostumers, createCostumer, updateCostumer, deleteCostumer };
