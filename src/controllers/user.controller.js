import userService from "../services/user.service.js";

const create = async (req, res) => {
  const body = req.body;
  try {
    const user = await userService.createService(body);

    return res.status(201).send(user);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const findAll = async (req, res) => {
  try {
    const users = await userService.findAllService();
    return res.send(users);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const findById = async (req, res) => {
  try {
    const id = req.params;
    const idAuth = req.userId;
    const user = await userService.findByIdService(id, idAuth);

    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { name, username, email, password, avatar, background } = req.body;
    const id = req.userId;
    const response = await userService.updateService({ name, username, email, password, avatar, background }, id);

    res.status(200).send(response);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

export default { create, findAll, findById, update };
