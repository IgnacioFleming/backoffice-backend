const registerUser = async (req, res) => {
  res.send({ status: "success", payload: "User registered." });
};

export default {
  registerUser,
};
