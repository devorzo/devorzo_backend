// eslint-disable-next-line no-unused-vars
import express, { Request, Response, NextFunction } from "express"
import { registerController, loginController, logoutController } from "../controllers/auth_controller"
import auth_middleware, { Auth } from "../middleware/auth_middleware"
// eslint-disable-next-line no-unused-vars
// import { Request, Response } from "../../interfaces/express"
const authService = (app: express.Application) => {
    const router = express.Router()

    router.get("/auth-service,", (req, res) => {
        res.send({ status: 200, success:true })
    })

    router.post("/register", (req: Request, res: Response, next: NextFunction) => {
        auth_middleware(req! as Request, res! as Response, next, Auth.IS_LOGGED_OUT)
    }, registerController)

    router.post("/login", (req: Request, res: Response, next: NextFunction) => {
        auth_middleware(req! as Request, res! as Response, next, Auth.IS_LOGGED_OUT)
    }, loginController)

    router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
        auth_middleware(req! as Request, res! as Response, next, Auth.IS_LOGGED_IN)
    }, logoutController)

    app.use(router)
}

export default authService