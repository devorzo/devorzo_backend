// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from "express"

import userController from "../../services/controllers/user_api_controller"
// import { Request, Response } from "../../interfaces/express"

// import path from "path"
// import _ from "lodash"

// let reactController = require("../controllers/reactController")
// let { registerController, loginController, logoutController } = require("../controllers/authUserController")
// let { auth, auth_semi } = require("../middlewares/auth")



const userApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/user-api-service,", (req: Request, res: Response) => {
        res.send({ status: 200, success: true })
    })

    // router.get("/")
    // Details
    router.get("/getUserUsingUuid", userController.userDetailsController)

    // Actions
    router.post("/followUserUsingUid")
    router.post("/unflollowUserUsingUid")
    router.get("/getAllUserFollowers")
    router.get("/getAllPeopleUserFollows")
    router.post("/doesUserFollowAnotherUserWithUuid")

    router.get("/getAllUserArticlesUsingUid")
    router.get("/getTopNUserArticles")
    router.get("/getBottomNUserArticles")

    router.get("/deleteUserAccount")
    router.get("/deleteUserAccountUsingUid")

    router.get("/getAllUserBookmarks")
    router.get("/removeFromBookmark")
    router.get("/removeAllBookMarks")

    router.get("/AddArticleToHistory")
    router.get("/getCompleteHistory")
    router.get("/getHistoryBetweenPeriod/:from/:to")
    router.get("/eraseFromHistory")
    router.get("/eraseHistoryBetweenPeriod/:from/:to")
    router.get("/eraseCompleteHistory")

    // Settings
    router.get("/updateUserSettings") //make sub routes
    router.get("/checkIfSettingsInitialised")
    // alter schema
    router.get("/checkIfUsernameIsUnique")
    router.get("/checkIfEmailIsUnique")
    router.get("/changeUserAsNormie")
    router.get("/changeUserAsModerator")
    router.get("/changeUserAsAdmin")

    router.get("/banUser")
    router.get("/banUserPermanently")
    router.get("/unbanUser")

    
    app.use(router)
}

export default userApiService