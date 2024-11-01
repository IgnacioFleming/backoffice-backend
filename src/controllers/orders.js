import { pool } from "../config/dbconfig-mysql.js";
import OrdersManager from "../dao/mysql/orders.js";
import { generateMockedOrders } from "../mocks/orders.js";

const getAll = async (req, res) => {
  const orders = await OrdersManager.getAll();
  res.json({ status: "success", payload: orders });
};
const getById = async (req, res) => {
  try {
    const { body } = req;
    const newOrder = await OrdersManager.create(body);
    console.log(body);
    if (newOrder?.error) return res.status(400).send({ status: "error", error: newOrder.error });

    res.json({ status: "success", payload: newOrder.status });
  } catch (error) {
    res.status(500).send({ status: "error", error });
  }
};
const create = async (req, res) => {
  try {
    const { body } = req;
    const newOrder = await OrdersManager.create(body);
    if (newOrder?.error) return res.status(400).send({ status: "error", error: newOrder.error });
    res.json({ status: "success", payload: newOrder.status });
  } catch (error) {
    res.status(500).send({ status: "error", error });
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
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOrder = await OrdersManager.delete(id);
    if (deleteOrder?.error) return res.status(400).send({ status: "error", error: deleteOrder.error });
    res.json({ status: "success", payload: deleteOrder.status });
  } catch (error) {
    res.status(500).send({ status: "error", error });
  }
};
const getOrdersByOrderNumber = async (req, res) => {
  const { sale_id } = req.params;
  const orders = await OrdersManager.getByOrderNumber(sale_id);
  res.json({ status: "success", payload: orders });
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
  deleteOrder,
  createMockedOrders,
  getOrdersByOrderNumber,
};
