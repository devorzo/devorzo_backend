import express from "express"
// import path from "path"
// import _ from "lodash"

// let reactController = require("../controllers/reactController")
// let { registerController, loginController, logoutController } = require("../controllers/authUserController")
// let { auth, auth_semi } = require("../middlewares/auth")

const uiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/", (req, res) => {
        res.render("index")
    })

    app.use(router)
}

export default uiService