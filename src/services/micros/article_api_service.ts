import express from "express"

import ArticleController from "../../services/controllers/article_controller"
import { auth_middleware_wrapper_IS_LOGGED_IN } from "../middleware/auth_middleware"

const articleApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/article-api-service,", (req, res) => {
        res.send({ status: 200, success: true })
    })

    router.post("/api/:version/createArticle",
        auth_middleware_wrapper_IS_LOGGED_IN,
        ArticleController.createArticle)

    router.get("/api/:version/getArticlesByUserUuid",
        auth_middleware_wrapper_IS_LOGGED_IN,
        ArticleController.getArticlesByUserUuid)

    router.get("/api/:version/getArticleByUuid",
        auth_middleware_wrapper_IS_LOGGED_IN,
        ArticleController.getArticleByUuid)

    // todo
    router.get("/api/:version/getArticleByTag",
        auth_middleware_wrapper_IS_LOGGED_IN)

    router.get("/api/:version/getArticleByCommunityId",
        auth_middleware_wrapper_IS_LOGGED_IN,
        ArticleController.getArticleByCommunityId)

    router.get("/api/:version/getTagsByArticleId")

    router.patch("/api/:version/updateArticleById",
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