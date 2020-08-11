import mongoose from "mongoose";
const initDb = () => {
  mongoose.Promise = global.Promise;
  mongoose
    .connect(process.env.MONGODB_URI!, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      connectTimeoutMS: 100,
    })
    .then(() => {
      console.log(" successfully connectd to mongodb");
    })
    .catch((e) => {
      console.log("eror connecting to mongodb ", e);
    });

  return mongoose;
};

export default initDb;
