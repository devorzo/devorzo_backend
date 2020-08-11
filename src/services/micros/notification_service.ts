import express from "express"
import Notifications from "../controllers/notification_controller"
// eslint-disable-next-line no-unused-vars
import { auth_IS_LOGGED_IN, checkIfUserIsAdmin } from "../middleware/auth_middleware"
import { responseMessageCreator } from "../../lib/response_message_creator"
const notificationApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/api/:version/notification-service", (req, res) => {
        let version = req.params.version
        if (version == "v1") {
            res.send({ status: 200, success: true })
        } else {
            res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
        }
    })

    router.post("/api/:version/sendVerificationEmail",
        auth_IS_LOGGED_IN,
        Notifications.sendVerificationEmail)

    router.post("/api/:version/sendPasswordResetEmail",
        auth_IS_LOGGED_IN,
        Notifications.sendPasswordResetEmail)

    // router.post("/api/:version/requestInviteCode",
    //     Notifications.requestInviteCode)

    // router.post("/api/:version/sendInviteEmail",
    //     auth_IS_LOGGED_IN,
    //     checkIfUserIsAdmin,
    //     Notifications.sendInviteEmail)
    app.use(router)
    // todo: api for news letter
}

export default notificationApiService