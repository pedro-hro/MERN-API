import { Router } from "express";
import userController from "../controllers/user.controller.js";
//import { validUser, validId } from "../middlewares/global.middlewares.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/", userController.create);
userRouter.get("/", userController.findAll);

userRouter.use(authMiddleware);
userRouter.get("/:id", userController.findById);
userRouter.patch("/", userController.update);

export default userRouter;
