import { pool } from "../config/dbconfig-mysql.js";
import OrdersManager from "../dao/mysql/orders.js";
import SalesManager from "../dao/mysql/sales.js";
import { generateMockedOrders } from "../mocks/orders.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import responses from "../utils/responses.js";

const getAll = async (req, res) => {
  const payload = await controllerHandlers.getResources(SalesManager, res);
  responses.successResponse(res, payload);
};

const create = async (req, res) => {
  try {
    const { body } = req;
    const payload = await controllerHandlers.validateBody(res, { sale_id: 1, ...body }, SalesManager);
    responses.successResponse(res, payload);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const updateOrder = await OrdersManager.update(id, body);
    if (updateOrder?.error) return res.status(400).send({ status: "error", error: updateOrder.error });
    res.json({ status: "success", payload: updateOrder });
  } catch (error) {
    res.status(500).send({ status: "error", error });
  }
};
const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteSale = await SalesManager.delete(id);
    if (deleteSale?.error) return res.status(400).send({ status: "error", error: deleteSale.error });
    res.json({ status: "success", payload: deleteSale.message });
  } catch (error) {
    res.status(500).send({ status: "error", error });
  }
};
const createMockedOrders = async (req, res) => {
  const { quantity } = req.query;
  const mockedOrders = await generateMockedOrders(quantity);
  mockedOrders.forEach(async (order) => {
    const [products] = await pool.query("SELECT id from products limit 100;");
    const randomProductID = products[Math.floor(Math.random() * 10 * 3)].id;
    order.product_id = randomProductID;
    await OrdersManager.create(order);
  });
  res.json({ status: "success", payload: "Orders created" });
};

export default {
  getAll,
  getById,
  create,
  update,
  deleteSale,
  createMockedOrders,
};
