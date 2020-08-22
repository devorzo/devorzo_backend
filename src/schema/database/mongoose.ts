import mongoose from 'mongoose';
import logger, { Level } from '../../lib/logger';

const initDb = (): void => {
  try {
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGODB_URI!, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }).then(() => {
      logger('connected to database');
    }).catch((e) => {
      logger({ error: e }, Level.ERROR);
    });
  } catch (e) {
    logger(e, Level.ERROR);
  }
};

export default initDb;
