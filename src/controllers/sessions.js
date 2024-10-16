import UserDto from "../dao/dto/user.js";

const registerUser = async (req, res) => {
  const user = new UserDto(req.user);
  res.send({ status: "success", payload: user });
};

const loginUser = async (req, res) => {
  const user = new UserDto(req.user);
  res.send({ status: "success", payload: user });
};

export default {
  registerUser,
  loginUser,
};
