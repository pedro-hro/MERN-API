import userRepository from "../repositories/user.repository.js";

const createService = async (body) => {
  const { name, username, email, password, avatar, background } = body;

  if (!name || !username || !email || !password || !avatar || !background)
    throw new Error("Submit all fields");

  const foundUser = await userRepository.findByEmailRepository(email);
  console.log(foundUser);
  if (foundUser) throw new Error("User already exists");

  const user = await userRepository.createRepository(body);

  if (!user) throw new Error("Error creating user");

  return user;
};

const findAllService = async () => {
  const users = await userRepository.findAllRepository();

  if (users.length === 0) throw new Error("There are no registered users.");

  return users;
};

const findByIdService = async (id, idAuth) => {
  let idParam;
  if (!id) {
    idParam = idAuth;
  } else {
    idParam = id;
  }
  if (!idParam) throw new Error("Send id to search for user");

  const user = await userRepository.findByIdRepository(idParam);

  if (!user) throw new Error("User not found");

  return user;
};

const updateService = async (body, id) => {
  const { name, username, email, password, avatar, background } = body;
  if (
    !name &&
    !username &&
    !email &&
    !password &&
    !avatar &&
    !background &&
    !password
  )
    throw new Error("Submit at least one field");

  /* const user = await userRepository.findByIdRepository(id);

  if (!user) throw new Error("User not found");

  if (user._id != id) throw new Error("You cannot update this user"); */

  if (password) password = await bcrypt.hash(password, 10);

  await userRepository.updateRepository(
    id,
    name,
    username,
    email,
    password,
    avatar,
    background
  );

  return { message: "User successfully updated" };
};

export default {
  createService,
  findAllService,
  findByIdService,
  updateService,
};
