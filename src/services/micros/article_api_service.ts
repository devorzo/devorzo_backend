import express from "express"

import ArticleController from "../../services/controllers/article_controller"

const articleApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/article-api-service,", (req, res) => {
        res.send({ status: 200, success: true })
    })

    // router.get("/")
    router.post("/api/:version/createArticle", ArticleController.createArticle)
    router.post("/api/:version/getArticleByUserId",ArticleController.getArticleByUserId)
    router.get("/api/:version/getArticleByTag")
    router.post("/api/:version/getArticleByCommunityId",ArticleController.getArticleByCommunityId) //completed

    router.get("/api/:version/getTagsByArticleId")//gaurav
        
    router.post("/api/:version/updateArticleById",ArticleController.UpdateArticleById)
    router.get("/api/:version/updateTagsByArticleId")//gaurav
    
    router.post("/api/:version/deleteArticleById",ArticleController.deleteArticleById)
    router.get("/api/:version/deleteAllUserArticleByUserId")//gaurav
    router.get("/api/:version/deleteAllCommunityArticleByCommunityId")//gaurav
    
    // router.get("/api/:version/")
    
    
    // router.get("/api/:version/getAllUserArticlesUsingUid")


    app.use(router)
}

export default articleApiService