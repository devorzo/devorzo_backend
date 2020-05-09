import express from "express"

import ArticleController from "../../services/controllers/article_controller"
import Article from "src/database/models/article"

const articleApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/article-api-service,", (req, res) => {
        res.send({ status: 200, success: true })
    })

    // router.get("/")
    router.post("/api/:version/createArticle", ArticleController.createArticle)
    router.get("/api/:version/getArticleByUserId", ArticleController.getArticleByUserId)
    router.get("/api/:version/getArticleByTag")
    router.get("/api/:version/getArticleByCommunityId",ArticleController.getArticleByCommunityId) 

    router.get("/api/:version/getTagsByArticleId")//gaurav
        
    router.post("/api/:version/updateArticleById",ArticleController.UpdateArticleById)
    router.get("/api/:version/updateTagsByArticleId")//gaurav
    
    router.delete("/api/:version/deleteArticleById",ArticleController.deleteArticleById)
    router.delete("/api/:version/deleteAllUserArticleByUserId", ArticleController.deleteAllUserArticleByUserId)//gaurav
    router.delete("/api/:version/deleteAllCommunityArticleByCommunityId", ArticleController.deleteAllCommunityArticleByCommunityId)//gaurav
    
    // router.get("/api/:version/")
    
    
    // router.get("/api/:version/getAllUserArticlesUsingUid")


    app.use(router)
}

export default articleApiService