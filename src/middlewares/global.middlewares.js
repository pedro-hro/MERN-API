const mongooose = require("mongoose");
const userService = require("../services/user.service");

const validId = (req, res, next) => {
    const id = req.params.id;

  if (!mongooose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid ID." });
  }

  next();
};

const validUser = async (req, res, next) => {
    const id = req.params.id;
    const user = await userService.findByIdService(id);

  if (!user) {
    return res.status(404).send({ message: "User not found." });
  }

  req.user = user
  req.id = id

  next();
};

module.exports = { validId, validUser};
