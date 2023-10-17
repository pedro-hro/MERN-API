import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { loginRepository } from "../repositories/auth.repository.js";

export async function generateToken(id) {
  return jwt.sign({ id: id }, process.env.SECRET_JWT, { expiresIn: 86400 });
}
export const loginService = async (email, password) => {
  const user = await loginRepository(email);

  if (!user) throw new Error("Invalid login or password.");

  const pswdIsValid = await bcrypt.compare(password, user.password);

  if (!pswdIsValid) throw new Error("Invalid login or password.");

  const token = await generateToken(user.id);

  return token;
};
