import passport from "passport";
import local from "passport-local";
import { userSchema } from "../schemas/user.js";
import { userRoles } from "../utils/roles.js";
import UsersManager from "../dao/mysql/users.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import jwt from "passport-jwt";
import config from "./config.js";

export const strategies = {
  REGISTER: "register",
  LOGIN: "login",
  RESTORE_PASSWORD: "restore_password",
  AUTH: "auth",
  JWT: "jwt",
};
const adminUser = {
  id: config.admin_keys.admin_id,
  username: config.admin_keys.admin_username,
  first_name: "Usuario Administrador",
  last_name: "",
  email: "",
  role: userRoles.SUPER_ADMIN,
  is_enabled: true,
};

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const LocalStrategy = local.Strategy;
const initializePassport = () => {
  passport.use(
    strategies.REGISTER,
    new LocalStrategy({ passReqToCallback: true, session: false }, async (req, username, password, done) => {
      try {
        const { body } = req;
        const user = await UsersManager.getByUsername(username);
        if (user.payload) return done(null, false, { message: "User already exists." });
        const hashedPassword = await createHash(password);
        const { success, data, error } = userSchema.safeParse({ ...body, id: 1, role: userRoles.READER, is_enabled: false, password: hashedPassword });
        if (!success) return done(error);
        const newUser = await UsersManager.create(data);

        if (newUser.payload) {
          return done(null, newUser.payload);
        } else {
          return done(null, false, { message: newUser.error });
        }
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.use(
    strategies.LOGIN,
    new LocalStrategy(async (username, password, done) => {
      try {
        if (username === config.admin_keys.admin_username) {
          if (password === config.admin_keys.admin_pwd) return done(null, adminUser);
          return done(null, false, { message: "Invalid password." });
        }
        const user = await UsersManager.getByUsername(username);
        if (!user.payload) return done(null, false, { message: "User not found." });
        const validation = await isValidPassword(password, user.payload);
        if (!validation) return done(null, false, { message: "Invalid password." });
        if (user.payload.is_enabled !== 1) return done(null, false, { message: "This User is not enabled yet." });
        return done(null, user.payload);
      } catch (error) {
        done(error);
      }
    })
  );

  passport.use(
    strategies.JWT,
    new JWTStrategy({ secretOrKey: config.auth.jwt_secret_key, jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() }, async (jwt_payload, done) => {
      try {
        const user = UsersManager.getById(jwt_payload.id);
        if (!user) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
};

export default initializePassport;
