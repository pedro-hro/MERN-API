import mongoose from "mongoose";
import userRepository from "../repositories/user.repository.js";

export const validId = (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid ID." });
    }

    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const validUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await userRepository.findByIdRepository(id);

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    req.user = user;
    req.id = id;

    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
