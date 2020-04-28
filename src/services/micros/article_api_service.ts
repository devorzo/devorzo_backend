import express from "express"
import ArticleController from "../../services/controllers/article_controller"
import Services from "../initService"

const articleApiService = (app: express.Application) => {
    const router = express.Router()

    router.get("/article-api-service,", (req, res) => {
        res.send({ status: 200, success: true })
    })

    // router.get("/")
    router.post("/api/:version/createArticle",ArticleController.createArticle)
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