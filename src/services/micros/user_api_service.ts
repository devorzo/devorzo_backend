// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from "express"
import userController from "../../services/controllers/user_api_controller"
import { auth_IS_LOGGED_IN } from "../middleware/auth_middleware"
import { responseMessageCreator } from "../../lib/response_message_creator"

const userApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/api/:version/user-api-service", (req: Request, res: Response) => {
        let version = req.params.version
        if (version == "v1") {
            res.send({ status: 200, success: true })
        } else {
            res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
        }
    })

    // router.get("/api/:version/")
    // Details
    router.get("/api/:version/getUserUsingId", userController.userDetailsController)

    router.get("/api/:version/getUserByUsername/:username", userController.getUserByUsername)

    // Actions
    router.post("/api/:version/followUserUsingUid",
        auth_IS_LOGGED_IN,
        userController.followUserUsingId)
    router.post("/api/:version/unflollowUserUsingUid",
        auth_IS_LOGGED_IN,
        userController.unfollowUserUsingId)
    router.get("/api/:version/getAllUserFollowers",
        auth_IS_LOGGED_IN,
        userController.getAllUserFollowers)
    router.get("/api/:version/getAllPeopleUserFollows",
        auth_IS_LOGGED_IN,
        userController.getAllPeopleUserFollows)
    router.post("/api/:version/doesUserFollowAnotherUserWithId",
        auth_IS_LOGGED_IN,
        userController.doesUserFollowAnotherUser)

    // todo: make routes with blog schema
    // router.get("/api/:version/getAllUserArticlesUsingUid")
    // router.get("/api/:version/getTopNUserArticles")
    // router.get("/api/:version/getBottomNUserArticles")

    // Settings
    router.post("/api/:version/updateUserSettings",
        auth_IS_LOGGED_IN,
        userController.updateUserSetting) //make sub routes
    // router.get("/api/:version/checkIfSettingsInitialised")

    router.post("/api/:version/deleteUserAccount",
        auth_IS_LOGGED_IN,
        userController.deleteAccount)

    // make other party(admin/moderator) only ban account

    // router.get("/deleteUserAccountUsingUid")

    router.post("/api/:version/likeArticle/",
        auth_IS_LOGGED_IN,
        userController.likeArticle)

    // bookmark features
    router.post("/api/:version/bookmarkArticle",
        auth_IS_LOGGED_IN,
        userController.bookmarkArticle)
    router.post("/api/:version/getAllUserBookmarks",
        auth_IS_LOGGED_IN,
        userController.getAllUserBookmarks)
    router.delete("/api/:version/removeAllBookMarks",
        auth_IS_LOGGED_IN,
        userController.removeAllUserBookmarks)

    // history features
    router.post("/api/:version/AddArticleToHistory",
        auth_IS_LOGGED_IN,
        userController.addToHistory)
    router.post("/api/:version/getCompleteHistory",
        auth_IS_LOGGED_IN,
        userController.getCompleteHistory)
    router.delete("/api/:version/removeArticleFromHistory",
        auth_IS_LOGGED_IN,
        userController.removeArticleFromHistory)
    router.delete("/api/:version/removeCompleteHistory",
        auth_IS_LOGGED_IN,
        userController.removeCompleteHistory)
    // router.post("/api/:version/getHistoryBetweenPeriod/:from/:to")
    // router.delete("/api/:version/eraseHistoryBetweenPeriod/:from/:to")


    // alter schema Instead make middleware
    // router.get("/api/:version/checkIfUsernameIsUnique")
    // router.get("/api/:version/checkIfEmailIsUnique")
    // router.get("/api/:version/changeUserAsNormie")
    // router.get("/api/:version/changeUserAsModerator")
    // router.get("/api/:version/changeUserAsAdmin")

    // admin api
    // router.get("/api/:version/banUser")
    // router.get("/api/:version/banUserPermanently")
    // router.get("/api/:version/unbanUser")


    app.use(router)
}

export default userApiService