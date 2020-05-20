import express from "express"
// import path from "path"
// import _ from "lodash"

// let reactController = require("../controllers/reactController")
// let { registerController, loginController, logoutController } = require("../controllers/authUserController")
// let { auth, auth_semi } = require("../middlewares/auth")
import community_api_controller from "../../services/controllers/community_api_controller"
import { auth_middleware_wrapper_IS_LOGGED_IN, checkIfUserIsAdminOrModerator, checkIfUserIsModerator } from "../middleware/auth_middleware"
import community from "src/database/models/communities"

const communityApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/community-service,", (req, res) => {
        res.send({ status: 200, success: true })
    })

    // router.get("/api/:version/")


    router.post("/api/:version/createCommunity",
        auth_middleware_wrapper_IS_LOGGED_IN,
        community_api_controller.createCommunity)

    router.get("/api/:version/getCommunityUsingId",
        community_api_controller.getCommunityUsingId)

    router.delete("/api/:version/removeCommunity",
        auth_middleware_wrapper_IS_LOGGED_IN,
        checkIfUserIsAdminOrModerator,
        community_api_controller.deleteCommunity)

    router.post("/api/:version/addUserToPrivateCommunity",
        auth_middleware_wrapper_IS_LOGGED_IN,
        checkIfUserIsModerator,
        community_api_controller.addUserToPrivateCommunity)

    router.post("/api/:version/removeUserFromCommunity",
        auth_middleware_wrapper_IS_LOGGED_IN,
        checkIfUserIsModerator,
        community_api_controller.removeUserFromCommunity)

    router.post("/api/:version/followPublicCommunity",
        auth_middleware_wrapper_IS_LOGGED_IN,
        community_api_controller.followPublicCommunity)

    router.post("/api/:version/unfollowCommunity",
        auth_middleware_wrapper_IS_LOGGED_IN,
        community_api_controller.unfollowCommunity)

    router.post("/api/:version/addUserAsModerator",
        auth_middleware_wrapper_IS_LOGGED_IN,
        checkIfUserIsModerator,
        community_api_controller.addUserAsModerator)

    router.post("/api/:version/changeCommunitySettings",
        auth_middleware_wrapper_IS_LOGGED_IN,
        checkIfUserIsModerator,
        community_api_controller.modifyCommunitySettings)
    app.use(router)
}

export default communityApiService
