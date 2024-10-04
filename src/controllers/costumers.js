import CostumersManager from "../dao/mysql/costumers.js";
import { generateMockedCostumers } from "../mocks/costumers.js";

const getCostumers = async (req, res) => {
  const costumers = await CostumersManager.getAll();
  res.json({ status: "success", payload: costumers });
};

const createCostumer = async (req, res) => {
  try {
    const { body } = req;
    const newCostumer = await CostumersManager.create(body);
    if (newCostumer?.error) return res.status(400).send({ status: "error", error: newCostumer.error });

    res.json({ status: "success", payload: newCostumer.status });
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
    res.json({ status: "success", payload: deleteCostumer.status });
  } catch (error) {
    res.status(500).send({ status: "error", error });
  }
};

const createMockedCostumers = async (req, res) => {
  const { quantity } = req.query;
  const mockedCostumers = await generateMockedCostumers(quantity);
  mockedCostumers.forEach(async (costumer) => {
    await CostumersManager.create(costumer);
  });
  res.json({ status: "success", payload: "Costumers created" });
};

export default { getCostumers, createCostumer, updateCostumer, deleteCostumer, createMockedCostumers };
