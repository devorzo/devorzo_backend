import express from "express"
// import path from "path"
// import _ from "lodash"
import Notifications from "../controllers/notification_controller"

import { auth_middleware_wrapper_IS_LOGGED_IN } from "../middleware/auth_middleware"
const notificationApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/notification-service", (req, res) => {
        res.send({ status: 200, success: true })
    })

    router.post("/api/:version/sendEmailVerificationEmail",
        auth_middleware_wrapper_IS_LOGGED_IN,
        Notifications.sendVerificationEmail)

    router.post("/api/:version/sendPasswordResetEmail",
        auth_middleware_wrapper_IS_LOGGED_IN,
        Notifications.sendPasswordResetEmail)
    app.use(router)


    // todo: api for news letter
}

export default notificationApiService