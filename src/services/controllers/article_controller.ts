import _ from "lodash"

import "../../database/models/article"

// eslint-disable-next-line no-unused-vars
import { Request, Response } from "express"
import logger, { Level } from "../../lib/logger"
import { responseMessageCreator } from "../../lib/response_message_creator"
import Article from "../../database/models/article"

export const createArticle = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["title", "content", "preview", "community_uuid"])

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
                "author_uuid": req.user.user_uuid,
                "community_uuid": (!body.community_uuid) ? "NA" : body.community_uuid,
                "belongs_to_community": (!body.community_uuid) ? 0 : 1,
            }
            let articleInstance = new Article(article) // document


            articleInstance.save(function (err, doc) {
                if (err) {
                    logger(err)
                    res.status(400).send(responseMessageCreator("Error occured", 1))
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

export const getArticleByUuid = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["article_uuid"])

        if (body.article_uuid == null) {
            res.status(400).send(responseMessageCreator("Invalid article uuid", 0))
        } else {
            Article.findOne({
                article_uuid: body.article_uuid
            }).then((doc: any) => {
                if (doc) {
                    console.log(doc)
                    res.send(responseMessageCreator({ data: doc }))
                } else {
                    res.send(responseMessageCreator("No Article found", 0))
                }
            })
        }
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}
export const getArticlesByUserUuid = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {

        let body = _.pick(req.body, ["author_uuid"])
        if (body.author_uuid == null) {
            res.status(400).send(responseMessageCreator("Invalid author uuid", 0))
        } else {
            Article.find({
                author_uuid: body.author_uuid
            }).then((doc: any) => {
                if (doc) {

                    // console.log(doc)
                    if (doc.length > 0) {
                        doc = doc.map((item: any) => {

                            let d = _.pick(item, ["created_on",
                                "article_uuid",
                                "views",
                                "community_uuid",
                                "belongs_to_community",
                                "moderation_status",
                                "duration_of_article",
                                "title",
                                "preview",
                                "likes",
                                "tags",
                            ])

                            d.likes = (d.likes) ? d.likes.length : 0;

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
        let body = _.pick(req.body, ["community_uuid"])

        if (body.community_uuid == null || body.community_uuid == "NA") {
            res.status(400).send(responseMessageCreator("Invalid community uuid", 0))
        } else {
            Article.find({
                community_uuid: body.community_uuid
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
        let body = _.pick(req.body, ["title", "content", "preview", "article_uuid"])
        if (body.article_uuid == null) {
            res.status(400).send(responseMessageCreator("Invalid article uuid", 0))
        } else if (body.title == null) {
            res.status(400).send(responseMessageCreator("Invalid article title", 0))
        } else if (body.title.length > 150) {
            res.status(400).send(responseMessageCreator("Invalid article title", 0))
        } else if (body.content == null) {
            res.status(400).send(responseMessageCreator("Invalid article content", 0))
        } else if (body.preview == null) {
            res.status(400).send(responseMessageCreator("Invalid article preview", 0))
        } else {

            Article.exists({
                article_uuid: body.article_uuid
            }).then((doc: any) => {
                if (doc) {
                    if (doc.author_uuid == req.user.user_uuid) {
                        Article.findOneAndUpdate({
                            article_uuid: body.article_uuid
                        }, {
                            title: body.title,
                            content: body.content,
                            preview: body.preview,
                            edited: 1,
                            last_edited_on: Date.now()
                        }).then((doc: any) => {
                            if (doc) {
                                res.send(responseMessageCreator({ data: doc }))
                            } else {
                                res.send(responseMessageCreator("No Article found", 0))
                            }
                        })
                    } else {
                        res.status(401).send(responseMessageCreator("INVALID AUTH"))
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
        // Article.deleteOne({ article_uuid: req.body.article_uuid }, function (err) {
        //     if (err) logger(err)
        //     else
        //         res.send(responseMessageCreator("Article has been deleted", 1))
        // })

        let body = _.pick(req.body, ["article_uuid"])

        if (body.article_uuid == null) {
            res.send(responseMessageCreator("Invalid article id", 0))
        } else {
            Article.exists({
                article_uuid: body.article_uuid
            }).then((doc: any) => {
                if (doc) {
                    if (doc.author_uuid == req.user.user_uuid) {
                        Article.deleteOne({
                            article_uuid: body.article_uuid
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
        let body = _.pick(req.body, ["author_uuid"])

        if (body.author_uuid == null) {
            res.status(400).send(responseMessageCreator("Invalid user id", 0))
        } else {
            Article.exists({
                author_uuid: body.author_uuid
            }).then((doc) => {
                if (doc) {
                    if (body.author_uuid == req.user.user_uuid) {
                        Article.deleteMany({
                            author_uuid: body.author_uuid
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
        Article.exists({ community_uuid: community_id }).then((result) => {
            if (result) {
                Article.deleteMany({ community_uuid: community_id }, (err) => {
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
    getArticleByUuid,
    getArticlesByUserUuid,
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