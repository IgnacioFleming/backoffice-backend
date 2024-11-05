import { pool } from "../config/dbconfig-mysql.js";
import OrdersManager from "../dao/mysql/orders.js";
import { generateMockedOrders } from "../mocks/orders.js";
import { orderSchema } from "../schemas/order.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import responses from "../utils/responses.js";

const getAll = async (req, res) => {
  const payload = await controllerHandlers.getResources(OrdersManager, res);
  responses.successResponse(res, payload);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const payload = await controllerHandlers.getResourcesById(id);
  responses.successResponse(res, payload);
};
const create = async (req, res) => {
  try {
    const { body } = req.body;
    const payload = await controllerHandlers.validateBody(res, body, OrdersManager, "create");
    responses.successResponse(res, payload);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const updatedOrder = await controllerHandlers.validateBody(res, body, orderSchema, "update", id);
    responses.successResponse(res, updatedOrder);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};
const deleteOrder = async (req, res) => {
  try {
    const payload = await controllerHandlers.deleteResource(req, OrdersManager);
    responses.successResponse(res, payload);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
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
  responses.successResponse(res, "Mocked Order created successfully.");
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
