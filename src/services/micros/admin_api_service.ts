import express from "express"

import { auth_middleware_wrapper_IS_LOGGED_IN, checkIfUserIsAdmin } from "../middleware/auth_middleware"
import AdminController from "../controllers/admin_controller"
const adminApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/admin-service,", (req, res) => {
        res.send({ status: 200, success: true })
    })

    router.post("/api/:version/getAllUsers",
        auth_middleware_wrapper_IS_LOGGED_IN,
        checkIfUserIsAdmin,
        AdminController.getAllUsers)

    router.post("/api/:version/getAllInviteRequests",
        auth_middleware_wrapper_IS_LOGGED_IN,
        checkIfUserIsAdmin,
        AdminController.getAllInviteRequests)

    router.post("/api/:version/getAllRejectedRequests",
        auth_middleware_wrapper_IS_LOGGED_IN,
        checkIfUserIsAdmin,
        AdminController.getAllRejectedRequests)

    router.post("/api/:version/rejectInviteRequest",
        auth_middleware_wrapper_IS_LOGGED_IN,
        checkIfUserIsAdmin,
        AdminController.rejectInviteRequest)

    app.use(router)
}

export default adminApiService