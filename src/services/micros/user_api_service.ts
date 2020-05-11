// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from "express"

import userController from "../../services/controllers/user_api_controller"

import { auth_middleware_wrapper_IS_LOGGED_IN } from "../middleware/auth_middleware"


const userApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/api/:version/user-api-service", (req: Request, res: Response) => {
        console.log("user api status")
        res.send({ status: 200, success: true })
    })

    // router.get("/api/:version/")
    // Details
    router.get("/api/:version/getUserUsingId", userController.userDetailsController)

    // Actions
    router.post("/api/:version/followUserUsingUid",
        auth_middleware_wrapper_IS_LOGGED_IN,
        userController.followUserUsingId)
    router.post("/api/:version/unflollowUserUsingUid",
        auth_middleware_wrapper_IS_LOGGED_IN,
        userController.unfollowUserUsingId)
    router.get("/api/:version/getAllUserFollowers",
        auth_middleware_wrapper_IS_LOGGED_IN,
        userController.getAllUserFollowers)
    router.get("/api/:version/getAllPeopleUserFollows",
        auth_middleware_wrapper_IS_LOGGED_IN,
        userController.getAllPeopleUserFollows)
    router.post("/api/:version/doesUserFollowAnotherUserWithId",
        auth_middleware_wrapper_IS_LOGGED_IN,
        userController.doesUserFollowAnotherUser)

    // todo: make routes with blog schema
    // router.get("/api/:version/getAllUserArticlesUsingUid")
    // router.get("/api/:version/getTopNUserArticles")
    // router.get("/api/:version/getBottomNUserArticles")

    // Settings
    router.post("/api/:version/updateUserSettings",
        auth_middleware_wrapper_IS_LOGGED_IN,
        userController.updateUserSetting) //make sub routes
    // router.get("/api/:version/checkIfSettingsInitialised")

    router.post("/api/:version/deleteUserAccount",
        auth_middleware_wrapper_IS_LOGGED_IN,
        userController.deleteAccount)

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


    // alter schema
    router.get("/api/:version/checkIfUsernameIsUnique")
    router.get("/api/:version/checkIfEmailIsUnique")
    router.get("/api/:version/changeUserAsNormie")
    router.get("/api/:version/changeUserAsModerator")
    router.get("/api/:version/changeUserAsAdmin")

    // admin api
    router.get("/api/:version/banUser")
    router.get("/api/:version/banUserPermanently")
    router.get("/api/:version/unbanUser")


    app.use(router)
}

export default userApiService