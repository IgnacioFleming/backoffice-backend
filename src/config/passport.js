import passport from "passport";
import local from "passport-local";
import { userSchema } from "../schemas/user.js";
import { userRoles } from "../utils/roles.js";
import UsersManager from "../dao/mysql/users.js";
import config from "./config.js";
import { createHash, isValidPassword } from "../utils/utils.js";

export const strategies = {
  REGISTER: "register",
  LOGIN: "login",
  RESTORE_PASSWORD: "restore_password",
};

const LocalStrategy = local.Strategy;
const initializePassport = () => {
  passport.use(
    strategies.REGISTER,
    new LocalStrategy({ passReqToCallback: true, session: true }, async (req, username, password, done) => {
      try {
        const { body } = req;
        const hashedPassword = await createHash(password);
        const { success, data, error } = userSchema.safeParse({ ...body, id: 1, role: userRoles.READER, is_enabled: false, password: hashedPassword });
        if (!success) return done(error);
        const newUser = await UsersManager.create(data);

        if (newUser.status === "success") {
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
        if (username === config.admin_keys.admin_username && password === config.admin_keys.admin_pwd) {
          const user = {
            username: config.admin_keys.admin_user,
            first_name: "Usuario Administrador",
            last_name: "",
            email: "",
            role: userRoles.SUPER_ADMIN,
            is_enabled: true,
          };
          return done(null, user);
        }
        const user = await UsersManager.getByUsername(username);
        if (!user.payload) return done(null, false, { message: "User not found." });
        const validation = await isValidPassword(password, user.payload);
        if (!validation) return done(null, false, { message: "Invalid password." });
        return done(null, user.payload);
      } catch (error) {
        done(error);
      }
    })
  );

  // passport.use(
  //   "restorePass",
  //   new JWTStrategy(
  //     {
  //       jwtFromRequest: ExtractJWT.fromExtractors([tokenExtractor]),
  //       secretOrKey: config.passport.jwt_secret_key,
  //     },
  //     async (jwt_payload, done) => {
  //       try {
  //         return done(null, jwt_payload);
  //       } catch (error) {
  //         return done(error);
  //       }
  //     }
  //   )
  // );

  // passport.serializeUser((user, done) => {
  //   done(null, user._id);
  // });
  // passport.deserializeUser(async (id, done) => {
  //   const user = await userService.getById(id);
  //   done(null, user.payload);
  // });
};

export default initializePassport;
