import express from "express"

import ArticleController from "../../services/controllers/article_controller"
import { auth_middleware_wrapper_IS_LOGGED_IN } from "../middleware/auth_middleware"
import { responseMessageCreator } from "../../lib/response_message_creator"
const articleApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/api/:version/article-api-service", (req, res) => {
        let version = req.params.version
        if (version == "v1") {
            res.send({ status: 200, success: true })
        } else {
            res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
        }
    })

    // router.get

    router.post("/api/:version/createArticle",
        auth_middleware_wrapper_IS_LOGGED_IN,
        ArticleController.createArticle)

    router.get("/api/:version/getArticlesByUserId",
        auth_middleware_wrapper_IS_LOGGED_IN,
        ArticleController.getArticlesByUserId)

    router.get("/api/:version/getArticlesByUsername/:username",
        ArticleController.getArticlesByUsername)

    router.post("/api/:version/getArticleById",
        ArticleController.getArticleById)

    // todo
    router.get("/api/:version/getArticleByTag",
        auth_middleware_wrapper_IS_LOGGED_IN)

    router.get("/api/:version/getLatestArticle",
        ArticleController.getLatestArticle)
    router.get("/api/:version/getPopularArticle",
        ArticleController.getPopularArticle)
    router.get("/api/:version/getFeaturedArticle",
        ArticleController.getFeaturedArticle)

    router.get("/api/:version/getArticleByCommunityId",
        auth_middleware_wrapper_IS_LOGGED_IN,
        ArticleController.getArticleByCommunityId)

    router.get("/api/:version/getTagsByArticleId")

    router.post("/api/:version/updateArticleById",
        auth_middleware_wrapper_IS_LOGGED_IN,
        ArticleController.UpdateArticleById)

    router.get("/api/:version/updateTagsByArticleId")


    router.delete("/api/:version/deleteArticleById",
        auth_middleware_wrapper_IS_LOGGED_IN,
        ArticleController.deleteArticleById)

    router.delete("/api/:version/deleteAllUserArticleByUserId",
        auth_middleware_wrapper_IS_LOGGED_IN,
        ArticleController.deleteAllUserArticleByUserId)

    router.delete("/api/:version/deleteAllCommunityArticleByCommunityId",
        auth_middleware_wrapper_IS_LOGGED_IN,
        ArticleController.deleteAllCommunityArticleByCommunityId)

    // router.get("/api/:version/")


    // router.get("/api/:version/getAllUserArticlesUsingUid")


    app.use(router)
}

export default articleApiService