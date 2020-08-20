// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Mongoose } from 'mongoose';

declare global {
  namespace NodeJS {
    interface Global {
      mongoose: Mongoose
    }
  }
}
