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
<<<<<<< HEAD
    router.get("/api/:version/getArticleByCommunityId",ArticleController.getArticleByCommunityId) //completed
=======
    router.get("/api/:version/getArticleByCommunityId",ArticleController.getArticleByCommunityId) 
>>>>>>> 3cdaecd7a1ea820fe5d0ae53bd6b63e866c4b774

    router.get("/api/:version/getTagsByArticleId")//gaurav
        
    router.patch("/api/:version/updateArticleById",ArticleController.UpdateArticleById)
    router.get("/api/:version/updateTagsByArticleId")//gaurav
    
    router.delete("/api/:version/deleteArticleById",ArticleController.deleteArticleById)
<<<<<<< HEAD
    router.get("/api/:version/deleteAllUserArticleByUserId")//gaurav
    router.get("/api/:version/deleteAllCommunityArticleByCommunityId")//gaurav
    router.get("/api/:version/updateArticleById")
    router.get("/api/:version/updateTagsByArticleId")//gaurav
    
    router.get("/api/:version/deleteArticleById")
=======
>>>>>>> 3cdaecd7a1ea820fe5d0ae53bd6b63e866c4b774
    router.delete("/api/:version/deleteAllUserArticleByUserId", ArticleController.deleteAllUserArticleByUserId)//gaurav
    router.delete("/api/:version/deleteAllCommunityArticleByCommunityId", ArticleController.deleteAllCommunityArticleByCommunityId)//gaurav
    
    // router.get("/api/:version/")
    
    
    // router.get("/api/:version/getAllUserArticlesUsingUid")


    app.use(router)
}

export default articleApiService