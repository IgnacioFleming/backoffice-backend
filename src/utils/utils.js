import bcrypt from "bcrypt";

export const createHash = async (password) => bcrypt.hash(password, bcrypt.genSaltSync(10));

export const isValidPassword = async (password, user) => bcrypt.compare(password, user.password);

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["sessionCookie"];
  }
  return token;
};

export const tokenExtractor = (req) => {
  let token = null;
  if (req && req.params.token) {
    token = req.params.token;
  }
  return token;
};
