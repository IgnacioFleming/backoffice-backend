import { pool } from "../config/dbconfig-mysql.js";
import OrdersManager from "../dao/mysql/orders.js";
import { generateMockedOrders } from "../mocks/orders.js";
import { orderSchema } from "../schemas/order.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import responses from "../utils/responses.js";
import { modelMethods } from "../utils/utils.js";

const getAll = async (req, res) => {
  await controllerHandlers.getResources(OrdersManager, res);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const { payload, error } = await controllerHandlers.getResourcesById(res, OrdersManager, id);
  if (error) return;
  console.log("paso por el order number");
  responses.successResponse(res, payload);
};
const create = async (req, res) => {
  try {
    const { body } = req.body;
    const { validatedBody } = await controllerHandlers.validateBody(res, body, orderSchema);
    await controllerHandlers.callModelAndRespond(res, validatedBody, OrdersManager, modelMethods.CREATE);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const { validatedBody } = await controllerHandlers.validateBody(res, body, orderSchema);
    await controllerHandlers.callModelAndRespond(res, validatedBody, OrdersManager, modelMethods.UPDATE, id);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};
const deleteOrder = async (req, res) => {
  try {
    await controllerHandlers.deleteResource(req, OrdersManager);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};
const getOrdersByOrderNumber = async (req, res) => {
  const { sale_id } = req.params;
  const { payload } = await OrdersManager.getByOrderNumber(sale_id);
  responses.successResponse(res, payload);
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
