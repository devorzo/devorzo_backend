import _ from "lodash"
import User from "../../database/models/user"
import Followers from "../../database/models/follower"
import jwt from "jsonwebtoken"

// eslint-disable-next-line no-unused-vars
import { Request, Response } from "express"
import logger, { Level } from "../../lib/logger"
import { responseMessageCreator } from "../../lib/response_message_creator"

import { cleanObject } from "../../lib/clean_object"

export const userDetailsController = (req: Request, res: Response) => {
    let version = req.params.version

    if (version == "v1") {
        let body = _.pick(req.body, ["id"])
        logger({ body }, Level.INFO)
        if (body.id == null || body.id == undefined) {
            res.status(400).send(responseMessageCreator("Bad user uuid", 0))
        }

        User.findOne({
            user_uuid: body.id
        }).then((doc) => {
            let d
            if (doc)
                d = doc.toJSON()
            res.send(responseMessageCreator(d))
        }).catch((e) => {
            res.status(400).send(responseMessageCreator(0, e))
        })
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const followUserUsingUuid = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["follower_id", "user_token"])

        let decoded: any = null
        if (req.session) {
            if (req.session.logged == true) {
                decoded = req.session.user_uuid
            }
        }
        if (decoded == null) {
            decoded = jwt.decode(body.user_token, { complete: true })
            decoded = decoded.user_uuid
        }

        if (decoded == null) {
            res.status(400).send(responseMessageCreator("Invalid or empty token.", 0))
        }

        Followers.findOneAndUpdate({
            user_uuid: decoded
        }, {
            $push: {
                followers: {
                    follower_uuid: body.follower_id,
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
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}


export const unfollowUserUsingUuid = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["follower_id", "user_token"])

        let decoded: any = null
        if (req.session) {
            if (req.session.logged == true) {
                decoded = req.session.user_uuid
            }
        }
        if (decoded == null) {
            decoded = jwt.decode(body.user_token, { complete: true })
            decoded = decoded.user_uuid
        }

        if (decoded == null) {
            res.status(400).send(responseMessageCreator("Invalid or empty token.", 0))
        }

        Followers.findOneAndUpdate({
            user_uuid: decoded
        }, {
            $pull: {
                followers: {
                    follower_uuid: body.follower_id
                }
            }
        }, function (err, doc) {
            if (!err) {
                res.send(responseMessageCreator(doc))
            } else {
                res.status(400).send(responseMessageCreator({ err, doc }, 0))
            }
        })
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const getAllUserFollowers = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["user_token"])
        let decoded: any = null
        if (req.session) {
            if (req.session.logged == true) {
                decoded = req.session.user_uuid
            }
        }
        if (decoded == null) {
            decoded = jwt.decode(body.user_token, { complete: true })
            decoded = decoded.user_uuid
        }

        if (decoded == null) {
            res.status(400).send(responseMessageCreator("Invalid or empty token.", 0))
        }

        Followers.findOne({
            user_uuid: decoded
        }, function (err, doc) {
            if (!err) {

                let count = doc?.followers.length
                let followers = doc?.followers
                res.send(responseMessageCreator({ count, followers }))
            } else {
                res.status(400).send(responseMessageCreator({ err, doc }, 0))
            }
        })
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}


export const getAllPeopleUserFollows = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["user_token"])

        let decoded: any = null
        if (req.session) {
            if (req.session.logged == true) {
                decoded = req.session.user_uuid
            }
        }
        if (decoded == null) {
            decoded = jwt.decode(body.user_token, { complete: true })
            decoded = decoded.user_uuid
        }

        if (decoded == null) {
            res.status(400).send(responseMessageCreator("Invalid or empty token.", 0))
        }

        let follower_uuid: string = decoded
        Followers.find({
            followers: {
                $elemMatch: {
                    follower_uuid
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
                decoded = req.session.user_uuid
            }
        }
        if (decoded == null) {
            decoded = jwt.decode(body.user_token, { complete: true })
            decoded = decoded.user_uuid
        }

        if (decoded == null) {
            res.status(400).send(responseMessageCreator("Invalid or empty token.", 0))
        }

        Followers.findOne({
            user_uuid: decoded,
            followers: {
                $elemMatch: {
                    follower_uuid: body.follower_id
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
                decoded = req.session.user_uuid
            }
        }
        if (decoded == null) {
            decoded = jwt.decode(body.user_token, { complete: true })
            decoded = decoded.user_uuid
        }

        if (decoded == null) {
            res.status(400).send(responseMessageCreator("Invalid or empty token.", 0))
        }

        if (body.confirm) {
            //todo: delete other schemas
            User.findOneAndDelete({
                user_uuid: decoded
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

export const getUserArticlesUsingID = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["user_id", "count", "token"])

        if (body.user_id == null) {
            res.status(400).send(responseMessageCreator("Invalid or empty user_id.", 0))
        }

        User.aggregate([
            {
                $match: {
                    user_uuid: body.user_id,
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
    let version = req.params.version;
    if (version == "v1") {
        let body = _.pick(req.body, ["fullname", "user_bio", "gender", "profile_image_link"])

        let data: any = {}
        body = cleanObject(body)
        console.log({ body })

        Object.entries(body).forEach(([key, value]) => {
            data[`details.${key}`] = value
        });

        console.log({ data })
        if (!(Object.keys(body).length === 0)) {

            if (Object.keys(body).length === 4 || req.body.initialiseUser == 1) {
                data['account_initialised'] = 1
            }
            User.findOneAndUpdate({
                user_uuid: req.user.user_uuid
            }, {
                $set: {
                    ...data
                }
            }, {
                new: true
            }).then((doc) => {
                res.send(responseMessageCreator({ doc }, 1))
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

export default {
    userDetailsController,

    followUserUsingUuid,
    unfollowUserUsingUuid,
    getAllUserFollowers,
    getAllPeopleUserFollows,
    doesUserFollowAnotherUser,

    deleteAccount,

    updateUserSetting
}

// export const s = (req: Request, res: Response) => {
//     let version = req.params.version;
//     if (version == "v1") {

//     } else {
//         res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
//     }
// }