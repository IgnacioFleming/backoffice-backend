import { pool } from "../config/dbconfig-mysql.js";
import OrdersManager from "../dao/mysql/orders.js";
import { generateMockedOrders } from "../mocks/orders.js";
import { orderSchema } from "../schemas/order.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import responses from "../utils/responses.js";
import { modelMethods } from "../utils/utils.js";

const getAll = async (req, res, next) => {
  try {
    await controllerHandlers.getResources(OrdersManager, res);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { payload } = await controllerHandlers.getResourcesById(OrdersManager, id);
    responses.successResponse(res, payload);
  } catch (error) {
    next(error);
  }
};
const create = async (req, res, next) => {
  try {
    const { body } = req;
    const { validatedBody } = await controllerHandlers.validateBody(body, orderSchema);
    await controllerHandlers.callModelAndRespond(res, validatedBody, OrdersManager, modelMethods.CREATE);
  } catch (error) {
    next(error);
  }
};
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const { payload: order } = await controllerHandlers.getResourcesById(OrdersManager, id);
    if (!order) throw createCustomError(ERRORS.NOT_FOUND, "ID provided does not correspond to a product");
    const updateOrder = { ...order, ...body };
    const { validatedBody } = await controllerHandlers.validateBody(updateOrder, orderSchema);
    await controllerHandlers.callModelAndRespond(res, validatedBody, OrdersManager, modelMethods.UPDATE, id);
  } catch (error) {
    next(error);
  }
};
const deleteOrder = async (req, res, next) => {
  try {
    await controllerHandlers.deleteResource(req, res, OrdersManager);
  } catch (error) {
    next(error);
  }
};
const getOrdersByOrderNumber = async (req, res, next) => {
  try {
    const { sale_id } = req.params;
    const { payload } = await OrdersManager.getByOrderNumber(sale_id);
    responses.successResponse(res, payload);
  } catch (error) {
    next(error);
  }
};

const createMockedOrders = async (req, res, next) => {
  try {
    const { quantity } = req.query;
    const mockedOrders = await generateMockedOrders(quantity);
    mockedOrders.forEach(async (order) => {
      const [products] = await pool.query("SELECT id from products limit 100;");
      const randomProductID = products[Math.floor(Math.random() * 10 * 3)].id;
      order.product_id = randomProductID;
      await OrdersManager.create(order);
    });
    responses.successResponse(res, "Mocked Order created successfully.");
  } catch (error) {
    next(error);
  }
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
