import _ from "lodash"

import "../../database/models/article"

// eslint-disable-next-line no-unused-vars
import { Request, Response } from "express"
import logger, { Level } from "../../lib/logger"
import { responseMessageCreator } from "../../lib/response_message_creator"
import Article, { randNum } from "../../database/models/article"
import { v4 } from "uuid"

export const createArticle = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["title", "content", "preview", "article_banner", "community_id"])

        if (body.title == null) {
            res.status(400).send(responseMessageCreator("Invalid article title", 0))
        } else if (body.title.length > 150) {
            res.status(400).send(responseMessageCreator("Invalid article title", 0))
        } else if (body.content == null) {
            res.status(400).send(responseMessageCreator("Invalid article content", 0))
        } else if (body.preview == null) {
            res.status(400).send(responseMessageCreator("Invalid article preview", 0))
        } else {


            let article = {
                "title": body.title,
                "content": body.content,
                "created_on": Date.now(),
                "preview": body.preview,
                "article_id": `article.${v4()}`,
                "article_banner": (body.article_banner) ? body.article_banner : "NA",
                "author_id": req.user.user_id,
                "community_id": (!body.community_id) ? "NA" : body.community_id,
                "belongs_to_community": (!body.community_id) ? 0 : 1,
            }
            let articleInstance = new Article(article) // document


            articleInstance.save(function (err, doc) {
                if (err) {
                    logger(err)
                    res.status(400).send(responseMessageCreator("Error occured", 0))
                } else {
                    logger("Article is saved in database sucessfully!")
                    res.send(responseMessageCreator({ data: doc, status: "Article saved successfully!" }, 1))
                }
            })
        }
    }
    else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const getArticleById = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["article_id"])

        if (body.article_id == null) {
            res.status(400).send(responseMessageCreator("Invalid article id", 0))
        } else {
            Article.findOne({
                article_id: body.article_id
            }).then((doc: any) => {
                if (doc) {
                    console.log(doc)
                    res.send(responseMessageCreator({ data: doc }))
                } else {
                    res.status(400).send(responseMessageCreator("No Article found", 0))
                }
            })
        }
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}
export const getArticlesByUserId = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {

        let body = _.pick(req.body, ["author_id"])
        if (body.author_id == null) {
            res.status(400).send(responseMessageCreator("Invalid author id", 0))
        } else {
            Article.find({
                author_id: body.author_id
            }).then((doc: any) => {
                if (doc) {

                    // console.log(doc)
                    if (doc.length > 0) {
                        doc = doc.map((item: any) => {

                            let d = _.pick(item, ["created_on",
                                "article_id",
                                "views",
                                "community_id",
                                "belongs_to_community",
                                "moderation_status",
                                "duration_of_article",
                                "title",
                                "preview",
                                "likes",
                                "tags",
                            ])

                            d.likes = (d.likes) ? d.likes.length : 0

                            return d
                        })
                    }
                    res.send(responseMessageCreator({ data: doc }))

                } else {
                    res.send(responseMessageCreator("Error", 0))
                }
            })
        }

    }
    else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}
export const getArticleByCommunityId = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["community_id"])

        if (body.community_id == null || body.community_id == "NA") {
            res.status(400).send(responseMessageCreator("Invalid community id", 0))
        } else {
            Article.find({
                community_id: body.community_id
            }).then((doc: any) => {
                if (doc) {
                    console.log(doc)
                    res.send(responseMessageCreator({ data: doc }))
                } else {
                    res.send(responseMessageCreator("Error", 0))
                }
            })
        }
    }
    else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}
export const UpdateArticleById = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["title", "content", "preview", "article_id", "article_banner"])
        if (body.article_id == null) {
            res.status(400).send(responseMessageCreator("Invalid article id", 0))
        } else if (body.title == null) {
            res.status(400).send(responseMessageCreator("Invalid article title", 0))
        } else if (body.title.length > 150) {
            res.status(400).send(responseMessageCreator("Invalid article title", 0))
        } else if (body.content == null) {
            res.status(400).send(responseMessageCreator("Invalid article content", 0))
        } else if (body.preview == null) {
            res.status(400).send(responseMessageCreator("Invalid article preview", 0))
        } else {

            Article.findOne({
                article_id: body.article_id
            }).then((doc: any) => {
                if (doc) {
                    if (doc.author_id == req.user.user_id) {
                        Article.findOneAndUpdate({
                            article_id: body.article_id,
                            author_id: req.user.user_id
                        }, {
                            title: body.title,
                            content: body.content,
                            preview: body.preview,
                            edited: 1,
                            last_edited_on: Date.now(),
                            article_banner: (body.article_banner) ? body.article_banner : "NA"
                        }).then((doc: any) => {
                            if (doc) {
                                res.send(responseMessageCreator({ data: doc }))
                            } else {
                                res.status(400).send(responseMessageCreator("No Article found", 0))
                            }
                        })
                    } else {
                        res.status(401).send(responseMessageCreator("Invalid Auth", 0))
                    }
                } else {
                    res.status(400).send(responseMessageCreator("No Article found", 0))
                }
            })
        }
    }
    else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}
export const deleteArticleById = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        // Article.deleteOne({ article_id: req.body.article_id }, function (err) {
        //     if (err) logger(err)
        //     else
        //         res.send(responseMessageCreator("Article has been deleted", 1))
        // })

        let body = _.pick(req.body, ["article_id"])

        if (body.article_id == null) {
            res.send(responseMessageCreator("Invalid article id", 0))
        } else {
            Article.exists({
                article_id: body.article_id
            }).then((doc: any) => {
                if (doc) {
                    if (doc.author_id == req.user.user_id) {
                        Article.deleteOne({
                            article_id: body.article_id
                        }).then((d) => {
                            res.send(responseMessageCreator({ data: d }, 1))
                        }).catch((e) => {
                            res.send(responseMessageCreator(e, 0))
                        })
                    } else {
                        res.status(401).send(responseMessageCreator("INVALID AUTH", 0))
                    }
                } else {
                    res.status(400).send(responseMessageCreator("No Article found", 0))
                }
            })
        }

    }
    else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const deleteAllUserArticleByUserId = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["author_id"])

        if (body.author_id == null) {
            res.status(400).send(responseMessageCreator("Invalid user id", 0))
        } else {
            Article.exists({
                author_id: body.author_id
            }).then((doc) => {
                if (doc) {
                    if (body.author_id == req.user.user_id) {
                        Article.deleteMany({
                            author_id: body.author_id
                        }).then((doc) => {
                            if (doc) {
                                res.send(responseMessageCreator("Successfully deleted all articles", 1))
                            } else {

                            }
                        }).catch((e) => {
                            res.status(400).send(responseMessageCreator(e, 0))
                        })
                    } else {
                        res.status(401).send(responseMessageCreator("INVALID AUTH", 0))
                    }
                } else {
                    res.status(400).send(responseMessageCreator("No user found", 0))
                }
            })
        }
    }
    else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}


export const deleteAllCommunityArticleByCommunityId = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        if (!Object.prototype.hasOwnProperty.call(req.body, "community_id")) {
            res.status(400).send(responseMessageCreator("No community id is provided!", 0))
            return
        }
        const community_id = req.body.community_id
        Article.exists({ community_id: community_id }).then((result) => {
            if (result) {
                Article.deleteMany({ community_id: community_id }, (err) => {
                    if (err) {
                        logger(err)
                        res.status(500).send(responseMessageCreator("Internal Server Error!", 0))
                    }
                    else {
                        res.status(200).send(responseMessageCreator("Articles of this community deleted Successfully", 1))
                    }
                })
            }
            else {
                res.status(404).send(responseMessageCreator("No articles present in this community!", 0))
            }
        }).catch((err) => {
            logger(err)
            res.status(500).send(responseMessageCreator("Internal Server Error!", 0))
        })
    }
    else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export default {
    createArticle,
    getArticleById,
    getArticlesByUserId,
    getArticleByCommunityId,
    UpdateArticleById,
    deleteArticleById,
    deleteAllUserArticleByUserId,
    deleteAllCommunityArticleByCommunityId
}
// export const s = (req: Request, res: Response) => {
//     let version = req.params.version
//     if (version == "v1") {

//     } else {
//         res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
//     }
// }