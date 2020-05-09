// eslint-disable-next-line no-unused-vars
import express, { Request, Response, NextFunction } from "express"
import auth_controller from "../controllers/auth_controller"
import { auth_middleware_wrapper_IS_LOGGED_OUT, auth_middleware_wrapper_IS_LOGGED_IN } from "../middleware/auth_middleware"
// eslint-disable-next-line no-unused-vars
// import { Request, Response } from "../../interfaces/express"
const authService = (app: express.Application) => {
    const router = express.Router()

    router.get("/auth-service,", (req, res) => {
        res.send({ status: 200, success: true })
    })

    router.post("/register",
        auth_middleware_wrapper_IS_LOGGED_OUT,
        auth_controller.registerController)

    router.post("/login",
        auth_middleware_wrapper_IS_LOGGED_OUT,
        auth_controller.loginController)

    router.post("/logout",
        auth_middleware_wrapper_IS_LOGGED_IN,
        auth_controller.logoutController)

    router.post("/api/:version/verifyEmail",
        auth_middleware_wrapper_IS_LOGGED_IN,
        auth_controller.VerifyEmail
    )

    router.get("/api/:version/reset")

    app.use(router)
}

export default authService