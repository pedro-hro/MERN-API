import bcrypt from "bcryptjs";
import { loginService } from "../services/auth.service.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginService(email);

    if (!user) {
        return res.status(403).send({ message: "Invalid login or password." });
      }

    const pswdIsValid = await bcrypt.compare(password, user.password);

    if (!pswdIsValid) {
      return res.status(403).send({ message: "Invalid login or password." });
    }

    console.log(pswdIsValid);
    res.send("Login OK!");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export { login };
