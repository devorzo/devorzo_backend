import _ from "lodash"
import User from "../../database/models/user"
import Article from "../../database/models/article"
import Followers from "../../database/models/follower"
import jwt from "jsonwebtoken"

// eslint-disable-next-line no-unused-vars
import e, { Request, Response } from "express"
import logger, { Level } from "../../lib/logger"
import { responseMessageCreator } from "../../lib/response_message_creator"

import { cleanObject } from "../../lib/clean_object"

export const userDetailsController = (req: Request, res: Response) => {
    let version = req.params.version

    if (version == "v1") {
        let body = _.pick(req.body, ["id"])
        logger({ body }, Level.INFO)
        if (body.id == null || body.id == undefined) {
            res.status(400).send(responseMessageCreator("Invalid user id", 0))
        }

        User.findOne({
            user_id: body.id
        }).then((doc) => {
            let d
            if (doc)
                d = doc.toJSON()
            res.send(responseMessageCreator(d))
        }).catch((e) => {
            res.status(400).send(responseMessageCreator(e, 0))
        })
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const getUserByUsername = (req: Request, res: Response) => {
    let version = req.params.version

    if (version == "v1") {
        // logger({ body }, Level.INFO)
        // if (body.id == null || body.id == undefined) {
        //     res.status(400).send(responseMessageCreator("Invalid user id", 0))
        // }

        console.log({params: req.params})
        User.findOne({
            "details.username": req.params.username
        }).then((doc) => {
            if (doc) {
                res.send(responseMessageCreator({ data: doc.toJSON() }))
            } else {
                res.status(400).send(responseMessageCreator("Invalid username", 0))
            }
        }).catch((e) => {
            res.status(400).send(responseMessageCreator(e, 0))
        })
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const followUserUsingId = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["user_id"])
        if (body.user_id == null) {
            res.send(responseMessageCreator("Invalid user id", 0))
        } else {
            Followers.findOneAndUpdate({
                user_id: body.user_id
            }, {
                $push: {
                    followers: {
                        follower_id: req.user.user_id,
                        followed_on: Date.now()
                    }
                }
            }, function (err, doc) {
                if (!err) {
                    res.send(responseMessageCreator(doc))
                } else {
                    res.status(400).send(responseMessageCreator({ err, doc }, 0))
                }
            })
        }
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}


export const unfollowUserUsingId = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["user_id"])

        if (body.user_id == null) {
            res.send(responseMessageCreator("Invalid user id", 0))
        } else {
            Followers.findOneAndUpdate({
                user_id: body.user_id
            }, {
                $pull: {
                    followers: {
                        follower_id: req.user.user_id
                    }
                }
            }, function (err, doc) {
                if (!err) {
                    res.send(responseMessageCreator(doc))
                } else {
                    res.status(400).send(responseMessageCreator({ err, doc }, 0))
                }
            })
        }
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const getAllUserFollowers = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["user_id"])

        if (body.user_id == null) {
            res.send(responseMessageCreator("Invalid user id", 0))
        } else {
            Followers.findOne({
                user_id: body.user_id
            }, function (err, doc) {
                if (!err) {

                    let count = doc?.followers.length
                    let followers = doc?.followers
                    res.send(responseMessageCreator({ count, followers }))
                } else {
                    res.status(400).send(responseMessageCreator({ err, doc }, 0))
                }
            })
        }
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}


export const getAllPeopleUserFollows = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {

        let follower_id: string = req.user.user_id
        Followers.find({
            followers: {
                $elemMatch: {
                    follower_id
                }
            }
        }, function (err, doc) {
            if (!err) {

                // let count = doc
                // let followers = doc?.followers
                res.send(responseMessageCreator({ doc }))
            } else {
                res.status(400).send(responseMessageCreator({ err, doc }, 0))
            }
        })
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const doesUserFollowAnotherUser = (req: Request, res: Response) => {
    // todo: add conformation flag to use userToken from body 3m+

    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["follower_id", "user_token"])

        let decoded: any = null
        if (req.session) {
            if (req.session.logged == true) {
                decoded = req.session.user_id
            }
        }
        if (decoded == null) {
            decoded = jwt.decode(body.user_token, { complete: true })
            decoded = decoded.user_id
        }

        if (decoded == null) {
            res.status(400).send(responseMessageCreator("Invalid or empty token.", 0))
        }

        Followers.findOne({
            user_id: decoded,
            followers: {
                $elemMatch: {
                    follower_id: body.follower_id
                }
            }
        }, function (err, doc) {
            if (!err) {
                //todo: add boolean check
                res.send(responseMessageCreator(doc))
            } else {
                res.status(400).send(responseMessageCreator({ err, doc }, 0))
            }
        })
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const deleteAccount = (req: Request, res: Response) => {

    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["user_token", "confirm"])

        let decoded: any = null
        if (req.session) {
            if (req.session.logged == true) {
                decoded = req.session.user_id
            }
        }
        if (decoded == null) {
            decoded = jwt.decode(body.user_token, { complete: true })
            decoded = decoded.user_id
        }

        if (decoded == null) {
            res.status(400).send(responseMessageCreator("Invalid or empty token.", 0))
        }

        if (body.confirm) {
            //todo: delete other schemas
            User.findOneAndDelete({
                user_id: decoded
            }, function (err) {
                if (!err) {
                    res.send(responseMessageCreator("User deleted."))
                } else {
                    res.send(responseMessageCreator(0, err))
                }
            })
        }
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const getUserArticlesUsingId = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["user_id", "count", "token"])

        if (body.user_id == null) {
            res.status(400).send(responseMessageCreator("Invalid or empty user_id.", 0))
        }

        User.aggregate([
            {
                $match: {
                    user_id: body.user_id,
                    tokens: { token: body.token }
                }
            },
            {
                $group: {

                }
            }
        ], function (doc: any) {
            console.log(doc)
        })
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const updateUserSetting = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["fullname", "user_bio", "gender", "profile_image_link"])

        let data: any = new Object()
        body = cleanObject(body)
        console.log({ body })

        Object.entries(body).forEach(([key, value]) => {
            data[`details.${key}`] = value
        })

        console.log({ data })
        if (!(Object.keys(body).length === 0)) {

            if (Object.keys(body).length === 4 || req.body.initialiseUser == 1) {
                data["account_initialised"] = 1
            }
            User.findOneAndUpdate({
                user_id: req.user.user_id
            }, {
                $set: {
                    ...data
                }
            }, {
                new: true
            }).then((doc) => {
                if (doc)
                    res.send(responseMessageCreator({ user: doc.toJSON() }, 1))
                else
                    res.send(responseMessageCreator("Some error occured", 0))
            }).catch((e) => {
                res.status(400).send(responseMessageCreator({ e }, 0))
            })

        } else {
            res.send(responseMessageCreator("Invalid data provided", 0))
        }

    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const addToBookmark = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["article_id"])

        if (body.article_id == null) {
            res.status(400).send(responseMessageCreator("Invalid article id", 0))
        } else {
            Article.exists({
                article_id: body.article_id
            }).then((status) => {
                if (status) {
                    User.exists({
                        user_id: req.user.user_id,
                        "bookmarks.article_id": body.article_id
                    }).then((doc) => {
                        if (doc) {
                            res.send(responseMessageCreator("The article is already bookmarked", 0))
                        } else {
                            User.findOneAndUpdate({
                                user_id: req.user.user_id
                            }, {
                                $push: {
                                    bookmarks: {
                                        article_id: body.article_id,
                                        bookmarked_on: Date.now()
                                    }
                                }
                            }).then((doc2) => {
                                if (doc2) {
                                    res.send(responseMessageCreator("The article has been successfully bookmarked"))
                                } else {
                                    res.send(responseMessageCreator("Some error occured", 0))
                                }
                            })
                        }
                    })

                } else {
                    res.status(400).send(responseMessageCreator("Invalid article id", 0))
                }
            })
        }
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const getAllUserBookmarks = (req: Request, res: Response) => {
    let version = req.params.version

    console.log({ query: req.query, body: req.body })
    if (version == "v1") {
        User.findOne({
            user_id: req.user.user_id
        }).then((doc) => {
            if (doc) {
                let d = doc?.bookmarks.map((i) => {
                    return {
                        article_id: i.article_id,
                        bookmarked_on: i.bookmarked_on
                    }
                })
                res.send(responseMessageCreator({ data: d }))
            } else
                res.send(responseMessageCreator("Some error occured", 0))
        })
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const removeArticleFromBookmark = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["article_id"])

        if (body.article_id == null) {
            res.status(400).send(responseMessageCreator("Invalid article id", 0))
        } else {
            Article.exists({
                article_id: body.article_id
            }).then((status) => {
                if (status) {
                    User.exists({
                        user_id: req.user.user_id,
                        "bookmarks.article_id": body.article_id
                    }).then((doc) => {
                        if (!doc) {
                            res.send(responseMessageCreator("Article is not bookmarked", 0))
                        } else {
                            User.findOneAndUpdate({
                                user_id: req.user.user_id
                            }, {
                                $pull: {
                                    bookmarks: {
                                        article_id: body.article_id,
                                    }
                                }
                            }).then((doc2) => {
                                if (doc2) {
                                    res.send(responseMessageCreator("The article has been successfully removed from bookmark"))
                                } else {
                                    res.send(responseMessageCreator("Some error occured", 0))
                                }
                            })
                        }
                    })

                } else {
                    res.status(400).send(responseMessageCreator("Invalid article id", 0))
                }
            })
        }
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const removeAllUserBookmarks = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        User.exists({
            user_id: req.user.user_id,
        }).then((doc) => {
            if (!doc) {
                res.status(400).send(responseMessageCreator("Some error occured", 0))
            } else {
                User.findOneAndUpdate({
                    user_id: req.user.user_id
                }, {
                    bookmarks: []
                }).then((doc2) => {
                    if (doc2) {
                        res.send(responseMessageCreator("Bookmarks have been successfully removed"))
                    } else {
                        res.send(responseMessageCreator("Some error occured", 0))
                    }
                })
            }
        })
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const addToHistory = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["article_id"])

        if (body.article_id == null) {
            res.status(400).send(responseMessageCreator("Invalid article id", 0))
        } else {
            Article.exists({
                article_id: body.article_id
            }).then((status) => {
                if (status) {
                    User.exists({
                        user_id: req.user.user_id,
                    }).then((doc) => {
                        if (!doc) {
                            res.send(responseMessageCreator("Some error orrcured", 0))
                        } else {
                            User.findOneAndUpdate({
                                user_id: req.user.user_id
                            }, {
                                $push: {
                                    history: {
                                        article_id: body.article_id,
                                        visited_on: Date.now()
                                    }
                                }
                            }).then((doc2) => {
                                if (doc2) {
                                    res.send(responseMessageCreator("The article has been successfully added to history"))
                                } else {
                                    res.send(responseMessageCreator("Some error occured", 0))
                                }
                            })
                        }
                    })

                } else {
                    res.status(400).send(responseMessageCreator("Invalid article id", 0))
                }
            })
        }
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const getCompleteHistory = (req: Request, res: Response) => {
    let version = req.params.version

    console.log({ query: req.query, body: req.body })
    if (version == "v1") {
        User.findOne({
            user_id: req.user.user_id
        }).then((doc) => {
            if (doc) {
                let d = doc?.history.map((i) => {
                    return {
                        article_id: i.atricle_id,
                        viewed_on: i.viewed_on
                    }
                })
                res.send(responseMessageCreator({ data: d }))
            } else
                res.send(responseMessageCreator("Some error occured", 0))
        })
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const removeArticleFromHistory = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["article_id"])

        if (body.article_id == null) {
            res.status(400).send(responseMessageCreator("Invalid article id", 0))
        } else {
            Article.exists({
                article_id: body.article_id
            }).then((status) => {
                if (status) {
                    User.exists({
                        user_id: req.user.user_id,
                        "history.article_id": body.article_id
                    }).then((doc) => {
                        if (!doc) {
                            res.send(responseMessageCreator("Article is not in history", 0))
                        } else {
                            User.findOneAndUpdate({
                                user_id: req.user.user_id
                            }, {
                                $pull: {
                                    history: {
                                        article_id: body.article_id,
                                    }
                                }
                            }).then((doc2) => {
                                if (doc2) {
                                    res.send(responseMessageCreator("The article has been successfully removed from history"))
                                } else {
                                    res.send(responseMessageCreator("Some error occured", 0))
                                }
                            })
                        }
                    })

                } else {
                    res.status(400).send(responseMessageCreator("Invalid article id", 0))
                }
            })
        }
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const removeCompleteHistory = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        User.exists({
            user_id: req.user.user_id,
        }).then((doc) => {
            if (!doc) {
                res.status(400).send(responseMessageCreator("Some error occured", 0))
            } else {
                User.findOneAndUpdate({
                    user_id: req.user.user_id
                }, {
                    history: []
                }).then((doc2) => {
                    if (doc2) {
                        res.send(responseMessageCreator("Bookmarks have been successfully removed"))
                    } else {
                        res.send(responseMessageCreator("Some error occured", 0))
                    }
                })
            }
        })
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export default {
    userDetailsController,
    getUserByUsername,

    followUserUsingId,
    unfollowUserUsingId,
    getAllUserFollowers,
    getAllPeopleUserFollows,
    doesUserFollowAnotherUser,

    deleteAccount,

    updateUserSetting,

    addToBookmark,
    getAllUserBookmarks,
    removeAllUserBookmarks,
    removeArticleFromBookmark,

    addToHistory,
    getCompleteHistory,
    removeArticleFromHistory,
    removeCompleteHistory
}

// export const s = (req: Request, res: Response) => {
//     let version = req.params.version;
//     if (version == "v1") {

//     } else {
//         res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
//     }
// }