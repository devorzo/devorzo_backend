import express from "express"
// import path from "path"
// import _ from "lodash"

// let reactController = require("../controllers/reactController")
// let { registerController, loginController, logoutController } = require("../controllers/authUserController")
// let { auth, auth_semi } = require("../middlewares/auth")
import community_api_controller from "../../services/controllers/community_api_controller"

import community from "src/database/models/communities"

const communityApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/community-service,", (req, res) => {
        res.send({ status: 200, success: true })
    })

    // router.get("/api/:version/")
    router.post("/api/:version/createCommunity", community_api_controller.createCommunity)
    router.get("/api/:version/deleteCommunity")
    router.get("/api/:version/addUserToCommunity")
    router.get("/api/:version/removeUserFromCommunity")

    router.get("/api/:version/modifyCommunityDetails")
    router.get("/api/:version/setCommunityRules")
    router.get("/api/:version/setCommunityAbout")
    router.get("/api/:version/setCommunitySettings")
    router.get("/api/:version/setCommunityTheme")


    // router.get("/api/:version/")
    // router.get("/api/:version/")
    // router.get("/api/:version/")

    app.use(router)
}

export default communityApiService
