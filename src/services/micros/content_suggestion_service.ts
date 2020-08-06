import express from "express"
// import path from "path"
// import _ from "lodash"

// let reactController = require("../controllers/reactController")
// let { registerController, loginController, logoutController } = require("../controllers/authUserController")
// let { auth, auth_semi } = require("../middlewares/auth")

const suggestionApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/suggestion-service,", (req, res) => {
        res.send({ status: 200, success:true })
    })
    
    router.post("/api/:version/search")
    app.use(router)
}

export default suggestionApiService