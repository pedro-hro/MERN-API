const User = require("../models/User");

//"User.function", the function is a mangoose function.
const createService = (body) => User.create(body);
const findAllService = () => User.find();
const findByIdService = (id) => User.findById(id);

module.exports = { createService, findAllService, findByIdService };
