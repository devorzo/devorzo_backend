// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from "express"

import userController from "../../services/controllers/user_api_controller"

// let { registerController, loginController, logoutController } = require("../controllers/authUserController")
// let { auth, auth_semi } = require("../middlewares/auth")

const userApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/api/:version/user-api-service,", (req: Request, res: Response) => {
        res.send({ status: 200, success: true })
    })

    // router.get("/api/:version/")
    // Details
    router.get("/api/:version/getUserUsingUuid", userController.userDetailsController)

    // Actions
    router.post("/api/:version/followUserUsingUid", userController.followUserUsingUuid)
    router.post("/api/:version/unflollowUserUsingUid", userController.unfollowUserUsingUuid)
    router.get("/api/:version/getAllUserFollowers", userController.getAllUserFollowers)
    router.get("/api/:version/getAllPeopleUserFollows", userController.getAllPeopleUserFollows)
    router.post("/api/:version/doesUserFollowAnotherUserWithUuid", userController.doesUserFollowAnotherUser)

    // todo: make routes with blog schema
    // router.get("/api/:version/getAllUserArticlesUsingUid")
    // router.get("/api/:version/getTopNUserArticles")
    // router.get("/api/:version/getBottomNUserArticles")

    router.post("/api/:version/deleteUserAccount", userController.deleteAccount)
    
    // make other party(admin/moderator) only ban account

    // router.get("/deleteUserAccountUsingUid")

    // todo: bookmark features
    router.get("/api/:version/getAllUserBookmarks")
    router.get("/api/:version/removeFromBookmark")
    router.get("/api/:version/removeAllBookMarks")

    // todo: history features
    router.get("/api/:version/AddArticleToHistory")
    router.get("/api/:version/getCompleteHistory")
    router.get("/api/:version/getHistoryBetweenPeriod/:from/:to")
    router.get("/api/:version/eraseFromHistory")
    router.get("/api/:version/eraseHistoryBetweenPeriod/:from/:to")
    router.get("/api/:version/eraseCompleteHistory")

    // Settings
    router.get("/api/:version/updateUserSettings") //make sub routes
    router.get("/api/:version/checkIfSettingsInitialised")
    // alter schema
    router.get("/api/:version/checkIfUsernameIsUnique")
    router.get("/api/:version/checkIfEmailIsUnique")
    router.get("/api/:version/changeUserAsNormie")
    router.get("/api/:version/changeUserAsModerator")
    router.get("/api/:version/changeUserAsAdmin")

    router.get("/api/:version/banUser")
    router.get("/api/:version/banUserPermanently")
    router.get("/api/:version/unbanUser")


    app.use(router)
}

export default userApiService