import { Router } from "express";
import {
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
} from "../controllers/news.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const newsRouter = Router();

newsRouter.get("/", findAll);
newsRouter.get("/top", topNews);
newsRouter.get("/search", searchByTitle);

newsRouter.use(authMiddleware);
newsRouter.post("/", create);
newsRouter.get("/byUser", byUser);
newsRouter.get("/:id", findById);
newsRouter.patch("/:id", update);
newsRouter.delete("/:id", erase);
newsRouter.patch("/like/:id", likeNews);
newsRouter.patch("/comment/:id", addComment);
newsRouter.patch("/comment/:idNews/:idComment", deleteComment);

export default newsRouter;


