import passport from "passport";
import local from "passport-local";

export const strategyName = {
  REGISTER: "register",
  LOGIN: "login",
  RESTORE_PASSWORD: "restore_password",
};

const LocalStrategy = local.Strategy;
const initializePassport = () => {
  passport.use(
    strategyName.REGISTER,
    new LocalStrategy({ passReqToCallback: true, session: true }, async (req, username, password, done) => {
      try {
        let data = req.body;
        const user = await userService.getOne({ email: username });
        if (user.payload) {
          return done(null, false);
        }
        data.password = await createHash(password);
        data.role = data.role || "usuario";
        data.last_connection = Date();
        const newCart = await cartsService.createCart();
        data.cart = newCart.payload._id;
        const result = await userService.create(data);
        return done(null, result.payload);
      } catch (error) {
        return done(error);
      }
    })
  );

  // passport.use(
  //   "login",
  //   new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
  //     try {
  //       if (username === config.passport.admin_user && password === config.passport.admin_password) {
  //         const user = {
  //           email: username,
  //           status: "active",
  //           role: "admin",
  //           first_name: "Admin_User",
  //           _id: new ObjectId(),
  //         };
  //         return done(null, user);
  //       }
  //       const user = await userService.getOne({ email: username });
  //       if (!user.payload) return done(null, false, { message: "No se encontró el usuario" });
  //       const validation = await isValidPassword(password, user.payload);

  //       if (!validation) return done(null, false, { message: "Contraseña invalida" });
  //       const last_connection = await userService.update({ email: username }, { $set: { last_connection: Date() } });
  //       return done(null, user.payload);
  //     } catch (error) {
  //       done(error);
  //     }
  //   })
  // );

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
