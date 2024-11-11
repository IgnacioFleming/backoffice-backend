import PaymentsManager from "../dao/mysql/payments.js";
import { paymentSchema } from "../schemas/payments.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import { modelMethods } from "../utils/utils.js";

const create = async (req, res, next) => {
  const { body } = req;
  body.payment_amount = Number(body.payment_amount);
  const { validatedBody } = await controllerHandlers.validateBody(body, paymentSchema);
  await controllerHandlers.callModelAndRespond(res, validatedBody, PaymentsManager, modelMethods.CREATE);
};

export default { create };
