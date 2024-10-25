import { Router } from "express";
import usersController from "../controllers/users.js";
import { auth } from "../middlewares/auth/auth.js";
import { authorizationPolicy } from "../middlewares/rolePolicy/rolePolicy.js";
import { userRoles } from "../utils/roles.js";

export const usersRouter = Router();

usersRouter.get("/", auth, authorizationPolicy(userRoles.SUPER_ADMIN), usersController.getAll);
