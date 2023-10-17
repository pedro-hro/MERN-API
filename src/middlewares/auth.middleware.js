import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).send("No auth");
    }

    const parts = authorization.split(" ");
    const [schema, token] = parts;

    if (parts.length !== 2) {
      return res.status(401).send("No lenght");
    }

    if (schema !== "Bearer") {
      return res.status(401).send("No bearer");
    }

    jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
      if (error) {
        return res.status(401).send({ message: "Invalid Token!" });
      }

      const user = await userRepository.findByIdRepository(decoded.id);

      if (!user || !user.id) {
        return res.status(401).send({ message: "Invalid User!" });
      }
      req.userId = user.id;
      return next();
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
