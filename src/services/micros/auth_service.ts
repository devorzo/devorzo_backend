// eslint-disable-next-line no-unused-vars
import express, { Request, Response, NextFunction } from "express"
import { registerController, loginController, logoutController } from "../controllers/auth_controller"
import auth_middleware, { Auth } from "../middleware/auth_middleware"
// eslint-disable-next-line no-unused-vars
import { RequestInterface, ResponseInterface } from "../../interfaces/express"
const authService = (app: express.Application) => {
    const router = express.Router()

    router.get("/auth", (req: Request, res: Response) => {
        res.send("Auth!")
    })

    router.post("/register", (req: Request, res: Response, next: NextFunction) => {
        auth_middleware(req! as RequestInterface, res! as ResponseInterface, next, Auth.IS_LOGGED_IN)
    }, registerController)

    router.post("/login", (req: Request, res: Response, next: NextFunction) => {
        auth_middleware(req! as RequestInterface, res! as ResponseInterface, next, Auth.IS_LOGGED_IN)
    }, loginController)

    router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
        auth_middleware(req! as RequestInterface, res! as ResponseInterface, next, Auth.IS_LOGGED_OUT)
    }, logoutController)

    app.use(router)
}

export default authService