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
  AUTH: "auth",
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

const LocalStrategy = local.Strategy;
const initializePassport = () => {
  passport.use(
    strategies.REGISTER,
    new LocalStrategy({ passReqToCallback: true, session: true }, async (req, username, password, done) => {
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

  // passport.use(strategies.PROTECTED_URL,new LocalStrategy())

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

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async ({ id }, done) => {
    console.log(id, "id de deserializado");
    if (id === adminUser.id) return done(null, adminUser);
    const user = await UsersManager.getById(id);
    done(null, user.payload);
  });
};

export default initializePassport;
