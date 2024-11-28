import { Router } from "express";
import usersController from "../controllers/users.js";
import { authorizationPolicy } from "../middlewares/rolePolicy/rolePolicy.js";
import { userRoles } from "../utils/roles.js";
import { passportCall } from "../middlewares/auth/passportCall.js";
import { strategies } from "../config/passport.js";

export const usersRouter = Router();

usersRouter.get("/", passportCall(strategies.JWT), authorizationPolicy(userRoles.SUPER_ADMIN), usersController.getAll);
usersRouter.post("/:id/handleState", passportCall(strategies.JWT), authorizationPolicy(userRoles.SUPER_ADMIN), usersController.handleUserState);
