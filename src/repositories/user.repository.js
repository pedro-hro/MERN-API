import User from "../models/User.js";

//"User.function", the function is a mongoose function.
const createRepository = (body) => User.create(body);
const findAllRepository = () => User.find();
const findByIdRepository = (id) => User.findById(id);
const findByEmailRepository = (email) => User.findOne({ email: email });

const updateRepository = function (id, name, username, email, password, avatar, background) {
    return User.updateOne({ _id: id }, { name, username, email, password, avatar, background });
};

export default {
  createRepository,
  findAllRepository,
  findByIdRepository,
  updateRepository,
  findByEmailRepository,
};