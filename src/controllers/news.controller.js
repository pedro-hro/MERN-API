import {
  createService,
  findAllService,
  topNewsService,
  findByIdService,
  searchByTitleService,
  byUserService,
  updateService,
  eraseService,
  likeService,
  addCommentService,
  deleteCommentService,
} from "../services/news.service.js";

const create = async (req, res) => {
  const id = req.userId;
  try {
    const { title, text, banner } = req.body;

    if (!title || !text || !banner) {
      res.status(400).send({ message: "Submit all fields" });
    }
    await createService({ title, text, banner }, id);

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const findAll = async (req, res) => {
  try {
    const query = req.query;
    const baseUrl = req.baseUrl;

    const news = await findAllService(query);
    return res.status(200).send(news);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const topNews = async (req, res) => {
  try {
    const results = await topNewsService();
    return res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const findById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await findByIdService(id);
    return res.status(200).send(news);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const searchByTitle = async (req, res) => {
  const { title } = req.query;
  try {
    const results = await searchByTitleService(title);
    return res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const byUser = async (req, res) => {
  try {
    const id = req.userId;
    const results = await byUserService(id);

    return res.status(200).send(results);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const update = async (req, res) => {
  const { title, text, banner } = req.body;
  const { id } = req.params;
  const userId = req.userId;
  try {
    await updateService(id, title, text, banner, userId);
    return res.status(200).send({ message: "News updated successfully." });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

const erase = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    await eraseService(id, userId);
    return res.status(200).send({ message: "News deleted successfully." });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

const likeNews = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const status = await likeService(id, userId);

    res.send(status);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

const addComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { comment } = req.body;
  try {
    await addCommentService(id, userId, comment);
    res.send({ message: "Comment added successfully." });
  } catch (empty) {
    res.status(500).send({ message: e.message });
  }
};

const deleteComment = async (req, res) => {
  const { idNews, idComment } = req.params;
  const userId = req.userId;
  try {
    await deleteCommentService(idNews, idComment, userId);
    res.send({
      message: "Comment successfully removed!",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export {
  create,
  findAll,
  topNews,
  findById,
  searchByTitle,
  byUser,
  update,
  erase,
  likeNews,
  addComment,
  deleteComment,
};
