import { mockCostumers } from "../assests/mockCostumers.js";
import { costumerSchema } from "../schemas/costumers.js";
const costumers = mockCostumers;

const getCostumers = async (req, res) => {
  res.json({ status: "success", payload: costumers });
};

const createCostumer = async (req, res) => {};

const updateCostumer = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const costumerIndex = costumers.findIndex((costumer) => costumer.id.toString() === id);
    const updatedCostumers = costumers.map((costumer) => {
      if (costumer.id.toString() === id) {
        const { success, data, error } = costumerSchema.safeParse({ ...costumer, ...body });
        if (!success) throw res.json({ status: "error", error });
        return data;
      }
      return costumer;
    });
    res.json({ status: "success", payload: updatedCostumers[costumerIndex] });
  } catch (error) {
    console.log("Exception throwed");
  }
};

const deleteCostumer = async (req, res) => {};

export default { getCostumers, createCostumer, updateCostumer, deleteCostumer };
