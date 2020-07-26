// eslint-disable-next-line no-unused-vars
import express, { Request, Response, NextFunction } from "express"
import auth_controller from "../controllers/auth_controller"
import { auth_IS_LOGGED_OUT, auth_IS_LOGGED_IN } from "../middleware/auth_middleware"
import { responseMessageCreator } from "../../lib/response_message_creator"
const authService = (app: express.Application) => {
    const router = express.Router()

    router.get("/api/:version/auth-service", (req, res) => {
        let version = req.params.version
        if (version == "v1") {
            res.send({ status: 200, success: true })
        } else {
            res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
        }
    })

    router.post("/register",
        auth_IS_LOGGED_OUT,
        auth_controller.registerController)

    router.post("/login",
        auth_IS_LOGGED_OUT,
        auth_controller.loginController)

    router.post("/logout",
        auth_IS_LOGGED_IN,
        auth_controller.logoutController)

    router.post("/api/:version/verifyEmail",
        auth_IS_LOGGED_IN,
        auth_controller.VerifyEmail
    )

    router.get("/api/:version/reset")

    app.use(router)
}

export default authService