import mongooose from "mongoose";

const connectDatabase = () => {
  console.log("Waiting connection with database...");

  mongooose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Atlas Connected"))
    .catch((error) => console.log(error));
};

export default connectDatabase;
