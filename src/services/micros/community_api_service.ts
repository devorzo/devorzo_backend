import express from "express"
import community_api_controller from "../../services/controllers/community_api_controller"
import { auth_IS_LOGGED_IN, checkIfUserIsAdminOrModerator, checkIfUserIsModerator } from "../middleware/auth_middleware"
import { responseMessageCreator } from "../../lib/response_message_creator"

const communityApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/api/:version/community-service", (req, res) => {
        let version = req.params.version
        if (version == "v1") {
            res.send({ status: 200, success: true })
        } else {
            res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
        }
    })

    // router.get("/api/:version/")


    router.post("/api/:version/createCommunity",
        auth_IS_LOGGED_IN,
        community_api_controller.createCommunity)

    router.get("/api/:version/getCommunityUsingId",
        community_api_controller.getCommunityUsingId)

    router.delete("/api/:version/removeCommunity",
        auth_IS_LOGGED_IN,
        checkIfUserIsAdminOrModerator,
        community_api_controller.deleteCommunity)

    router.post("/api/:version/addUserToPrivateCommunity",
        auth_IS_LOGGED_IN,
        checkIfUserIsModerator,
        community_api_controller.addUserToPrivateCommunity)

    router.post("/api/:version/removeUserFromCommunity",
        auth_IS_LOGGED_IN,
        checkIfUserIsModerator,
        community_api_controller.removeUserFromCommunity)

    router.post("/api/:version/followPublicCommunity",
        auth_IS_LOGGED_IN,
        community_api_controller.followPublicCommunity)

    router.post("/api/:version/unfollowCommunity",
        auth_IS_LOGGED_IN,
        community_api_controller.unfollowCommunity)

    router.post("/api/:version/addUserAsModerator",
        auth_IS_LOGGED_IN,
        checkIfUserIsModerator,
        community_api_controller.addUserAsModerator)

    router.post("/api/:version/changeCommunitySettings",
        auth_IS_LOGGED_IN,
        checkIfUserIsModerator,
        community_api_controller.modifyCommunitySettings)
    app.use(router)
}

export default communityApiService
