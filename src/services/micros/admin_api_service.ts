import express from "express"

import { auth_IS_LOGGED_IN, checkIfUserIsAdmin } from "../middleware/auth_middleware"
import AdminController from "../controllers/admin_controller"
import { responseMessageCreator } from "../../lib/response_message_creator"
const adminApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/api/:version/admin-service", (req, res) => {
        let version = req.params.version
        if (version == "v1") {
            res.send({ status: 200, success: true })
        } else {
            res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
        }
    })

    router.post("/api/:version/getAllUsers",
        auth_IS_LOGGED_IN,
        checkIfUserIsAdmin,
        AdminController.getAllUsers)

    router.post("/api/:version/getAllInviteRequests",
        auth_IS_LOGGED_IN,
        checkIfUserIsAdmin,
        AdminController.getAllInviteRequests)

    router.post("/api/:version/getAllRejectedRequests",
        auth_IS_LOGGED_IN,
        checkIfUserIsAdmin,
        AdminController.getAllRejectedRequests)

    router.post("/api/:version/rejectInviteRequest",
        auth_IS_LOGGED_IN,
        checkIfUserIsAdmin,
        AdminController.rejectInviteRequest)

    app.use(router)
}

export default adminApiService