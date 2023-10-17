import News from "../models/News.js";

export const createRepository = (body) => News.create(body);

export const findAllRepository = (offset, limit) =>
  News.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user");

export const countNewsRepository = () => News.countDocuments();

export const topNewsRepository = () =>
  News.findOne().sort({ _id: -1 }).populate("user");

export const findByIdRepository = (id) => News.findById(id).populate("user");

export const searchByTitleRepository = (title) =>
  News.find({ title: { $regex: `${title || ""}`, $options: "i" } })
    .sort({ _id: -1 })
    .populate("user");

export const byUserRepository = (id) =>
  News.find({ user: id }).sort({ _id: -1 }).populate("user");

export const updateRepository = (id, title, text, banner) =>
  News.findOneAndUpdate(
    { _id: id },
    { title, text, banner },
    { rawResult: true }
  );

export const eraseRepository = (id) => News.findOneAndDelete({ _id: id });

export const likeRepository = (idNews, userId) =>
  News.findOneAndUpdate(
    { _id: idNews, "likes.userId": { $nin: [userId] } },
    { $push: { likes: { userId, created: Date.now() } } }
  );

export const deleteLikeRepository = (idNews, userId) =>
  News.findOneAndUpdate({ _id: idNews }, { $pull: { likes: { userId } } });

export const addCommentRepository = async (id, userId, comment) => {
  let idComment;

  do {
    idComment = Math.floor(Date.now() * Math.random()).toString(36);
  } while (idComment === "0");

  return await News.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        comments: { idComment, userId, comment, createdAt: new Date() },
      },
    }
  );
};

export const deleteCommentRepository = (idNews, idComment, userId) => {
  return News.findOneAndUpdate(
    { _id: idNews },
    { $pull: { comments: { idComment, userId } } }
  );
};
