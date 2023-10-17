import { loginService } from "../services/auth.service.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await loginService(email, password);
    return res.status(200).send({ token });
  } catch (e) {
    res.status(500).send(e.message);
  }
};
