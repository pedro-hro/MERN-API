import {
  createRepository,
  findAllRepository,
  countNewsRepository,
  topNewsRepository,
  findByIdRepository,
  searchByTitleRepository,
  byUserRepository,
  updateRepository,
  eraseRepository,
  likeRepository,
  deleteLikeRepository,
  addCommentRepository,
  deleteCommentRepository,
} from "../repositories/news.repository.js";

const createService = async ({ title, text, banner }, id) => {
  if (!title || !text || !banner) throw new Error("Submit all fields");

  await createRepository({
    title,
    text,
    banner,
    user: id,
  });

  return { message: "News created successfully." };
};

const findAllService = async (query, baseUrl) => {
  let { limit, offset } = query;
  limit = Number(limit || 5);
  offset = Number(offset || 0);

  const news = await findAllRepository(offset, limit);
  const total = await countNewsRepository();

  const currentUrl = baseUrl;

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

  return {
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
  };
};

const topNewsService = async () => {
  const news = await topNewsRepository();
  if (!news) {
    throw new Error("There are no created news.");
  }
  return {
    results: {
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
    },
  };
};

const findByIdService = async (id) => {
  const news = await findByIdRepository(id);
  if (!news) throw new Error("News not found");
  return {
    results: {
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
    },
  };
};

const searchByTitleService = async (title) => {
  const news = await searchByTitleRepository(title);

  if (news.length === 0) {
    throw new Error("There are no news with this title.");
  }

  return {
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
  };
};

const byUserService = async (id) => {
  const news = await byUserRepository(id);

  return {
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
  };
};

const updateService = async (id, title, text, banner, userId) => {
  if (!title && !text && !banner) throw new Error("Submit at least one field.");

  const news = await findByIdRepository(id);
  if (!news) throw new Error("News not found");
  //"news.user.id" and "req.userId" are of different types, any problem here use String(news.user.id), for now it worked properly.
  if (String(news.user._id) !== userId)
    throw new Error("You are not authorized to update this news.");

  await updateRepository(id, title, text, banner);
  return { message: "News successfully updated." };
};

const eraseService = async (id, userId) => {
  const news = await findByIdRepository(id);

  if (!news) throw new Error("News not found");

  if (news.user.id !== userId)
    throw new Error("You are not authorized to delete this news.");

  await eraseRepository(id);
};

const likeService = async (id, userId) => {
  const newsLiked = await likeRepository(id, userId);
  let like;
  if (!newsLiked) {
    await deleteLikeRepository(id, userId);
    return (like = "News unliked.");
  }
  like = "News liked.";
  return like;
};

const addCommentService = async (id, userId, comment) => {
  if (!comment) throw new Error("Comment cannot be empty.");

  await addCommentRepository(id, userId, comment);

  return { message: "Comment added successfully." };
};

const deleteCommentService = async (idNews, idComment, userId) => {
  /*
     The workflow of this request is the following:
     1. The repository is called right at the beginning of the request. ("await deleteCommentRepository()")
     2. The repository deletes or not the comment. ("$pull: { comments: { idComment, userId } }", in the 'news.repository.js', it requires the idComment and userId to delete the comment).
     3. The repository returns the deleted comment as it was when it found it, or return undefined. (this is stored in "newsToBeDeleted")
     4. The client is notified that the comment was successfully deleted or that it was not found, or that it was not authorized. (Both ifs do the verifications).
    */
  const newsToBeDeleted = await deleteCommentRepository(
    idNews,
    idComment,
    userId
  );

  const comment = newsToBeDeleted.comments.find(
    (comment) => comment.idComment === idComment
  );

  if (!comment) throw new Error("Comment not found.");

  if (comment.userId !== userId) throw new Error("You are not authorized.");

  return { message: "Comment deleted successfully." };
};

export {
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
};
