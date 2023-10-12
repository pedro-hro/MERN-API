import {
  createService,
  findAllService,
  countNews,
  topNewsService,
  findByIdService,
  searchByTitleService,
  byUserService,
  updateService,
  eraseService,
  likeService,
  deleteLikeService,
} from "../services/news.service.js";

const create = async (req, res) => {
  try {
    const { title, text, banner } = req.body;

    if (!title || !text || !banner) {
      res.status(400).send({ message: "Submit all fields" });
    }
    await createService({
      title,
      text,
      banner,
      user: req.userId,
    });

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const findAll = async (req, res) => {
  try {
    let { limit, offset } = req.query;
    limit = Number(limit || 5);
    offset = Number(offset || 0);

    const news = await findAllService(offset, limit);
    const total = await countNews();

    const currentUrl = req.baseUrl;

    const nextOffset = offset + limit;
    const nextUrl =
      nextOffset < total
        ? `${currentUrl}?limit=${limit}&offset=${nextOffset}`
        : null;

    const previousOffset = offset - limit < 0 ? null : offset - limit;
    const previousUrl =
      previousOffset != null
        ? `${currentUrl}?limit=${limit}&offset=${previousOffset}`
        : null;

    if (news.length === 0) {
      return res.status(400).send({ message: "There are no created news." });
    }

    res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,
      results: news.map((newsItem) => ({
        id: newsItem._id,
        title: newsItem.title,
        text: newsItem.text,
        banner: newsItem.banner,
        likes: newsItem.likes,
        comments: newsItem.comments,
        name: newsItem.user.name,
        username: newsItem.user.username,
        userAvatar: newsItem.user.avatar,
      })),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const topNews = async (req, res) => {
  try {
    const news = await topNewsService();
    if (!news) {
      return res.status(400).send({ message: "There are no created news." });
    }
    res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        username: news.user.username,
        userAvatar: news.user.avatar,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const findById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await findByIdService(id);
    res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        username: news.user.username,
        userAvatar: news.user.avatar,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    const news = await searchByTitleService(title);

    if (news.length === 0) {
      return res
        .status(400)
        .send({ message: "There are no news with this title." });
    }

    res.send({
      results: news.map((newsItem) => ({
        id: newsItem._id,
        title: newsItem.title,
        text: newsItem.text,
        banner: newsItem.banner,
        likes: newsItem.likes,
        comments: newsItem.comments,
        name: newsItem.user.name,
        username: newsItem.user.username,
        userAvatar: newsItem.user.avatar,
      })),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const byUser = async (req, res) => {
  try {
    const id = req.userId;
    const news = await byUserService(id);
    res.send({
      results: news.map((newsItem) => ({
        id: newsItem._id,
        title: newsItem.title,
        text: newsItem.text,
        banner: newsItem.banner,
        likes: newsItem.likes,
        comments: newsItem.comments,
        name: newsItem.user.name,
        username: newsItem.user.username,
        userAvatar: newsItem.user.avatar,
      })),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { title, text, banner } = req.body;
    const { id } = req.params;

    if (!title && !text && !banner) {
      res.status(400).send({ message: "Submit at least one field." });
    }

    const news = await findByIdService(id);

    //"news.user.id" and "req.userId" are of different types, any problem here use String(news.user.id), for now it worked properly.
    if (news.user.id !== req.userId) {
      return res
        .status(401)
        .send({ message: "You are not authorized to update this news." });
    }

    await updateService(id, title, text, banner);
    return res.status(200).send({ message: "News updated successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const erase = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await findByIdService(id);

    if (news.user.id !== req.userId) {
      return res
        .status(401)
        .send({ message: "You are not authorized to delete this news." });
    }

    await eraseService(id);
    return res.status(200).send({ message: "News deleted successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const likeNews = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const newsLiked = await likeService(id, userId);

    if (!newsLiked) {
      await deleteLikeService(id, userId);
      return res.status(200).send({ message: "News unliked successfully." });
    }

    res.send({ message: "News liked." });
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
};
