import express from "express"
// import path from "path"
// import _ from "lodash"

// let reactController = require("../controllers/reactController")
// let { registerController, loginController, logoutController } = require("../controllers/authUserController")
// let { auth, auth_semi } = require("../middlewares/auth")

const notificationApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/notification-service,", (req, res) => {
        res.send({ status: 200, success:true })
    })
    
    app.use(router)
}

export default notificationApiService