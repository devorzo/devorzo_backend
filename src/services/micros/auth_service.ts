import express from "express"
// import path from "path"
// import _ from "lodash"

// let reactController = require("../controllers/reactController")
import { registerController, loginController, logoutController } from "../controllers/auth_controller"
// let { auth, auth_semi } = require("../middlewares/auth")

const authService = (app: express.Application) => {
    const router = express.Router()

    router.get("/auth", (req: express.Request, res: express.Response) => {
        res.send("Auth!")
    })
    router.post("/register", registerController)

    router.post("/login", loginController)

    router.get("/logout", logoutController)

    app.use(router)
}

export default authService