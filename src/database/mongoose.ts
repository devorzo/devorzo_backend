import mongoose from "mongoose"
const initDb = () => {
    mongoose.Promise = global.Promise
    mongoose.connect(process.env.MONGODB_URI!, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })

    return mongoose
}

export default initDb
