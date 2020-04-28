import express from "express"
<<<<<<< HEAD
import ArticleController from "../../services/controllers/article_controller"
import Services from "../initService"
=======

import ArticleController from "../../services/controllers/article_controller"
>>>>>>> db26d081c55486a767e7d30bb7b4865991b36e6e

const articleApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/article-api-service,", (req, res) => {
        res.send({ status: 200, success: true })
    })

    // router.get("/")
<<<<<<< HEAD
    router.post("/api/:version/createArticle",ArticleController.createArticle)
=======
    router.get("/api/:version/createArticle", ArticleController.createArticle)
>>>>>>> db26d081c55486a767e7d30bb7b4865991b36e6e
    router.get("/api/:version/getArticleByUserId")
    router.get("/api/:version/getArticleByTag")
    router.get("/api/:version/getArticleByCommunityId")

    router.get("/api/:version/getTagsByArticleId")
        
    router.get("/api/:version/updateArticleById")
    router.get("/api/:version/updateTagsByArticleId")
    
    router.get("/api/:version/deleteArticleById")
    router.get("/api/:version/deleteAllUserArticleByUserId")
    router.get("/api/:version/deleteAllCommunityArticleByCommunityId")
    
    // router.get("/api/:version/")
    
    
    // router.get("/api/:version/getAllUserArticlesUsingUid")


    app.use(router)
}

export default articleApiService