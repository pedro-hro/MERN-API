import { createService, findAllService } from "../services/news.service.js";

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
      user: { _id: "650c916b329289d34cc75d81" },
    });

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const findAll = async (req, res) => {
  try {
    const news = await findAllService();

    if (news.lenght === 0) {
      return res.status(400).send({ message: "There are no created news." });
    }

    res.send(news);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export { create, findAll };
