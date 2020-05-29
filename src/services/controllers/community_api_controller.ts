import _ from "lodash"
import "../../database/models/communities"
import "../../database/models/user"

// eslint-disable-next-line no-unused-vars
import { Request, Response } from "express"
import logger, { Level } from "../../lib/logger"
import { responseMessageCreator } from "../../lib/response_message_creator"
import Community, { Role, CommunityMode } from "../../database/models/communities"
import User from "../../database/models/user"
import { v4 } from "uuid"
import { validateEmail } from "../../lib/validate_email"


export const createCommunity = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["rules", "name", "about", "community_mode"])
        if (body.rules == null) {
            res.send(responseMessageCreator("Please provide valid rules for community", 0))
        } else if (body.name == null) {
            res.send(responseMessageCreator("Please provide a valid name for your community", 0))
        } else if (body.about == null) {
            res.send(responseMessageCreator("Please provide a valid description for your community", 0))
        } else if (req.body.name > 150) {
            res.send(responseMessageCreator("Please provide a valid name for your community", 0))
        } else {
            let ts = Date.now()
            let communityObject = {
                name: req.body.name,
                rules: req.body.rules,
                about: req.body.about,
                community_id: `community.${v4()}`,
                created_on: ts,
                community_mode: (body.community_mode == null) ? 0 : body.community_mode,
                users_list: [{
                    user_id: req.user.user_id,
                    user_role: Role.ADMIN,
                    joined_on: ts
                }]
            }

            let communityInstance = new Community(communityObject)

            communityInstance.save().then((doc) => {
                if (doc) {
                    res.send(responseMessageCreator({ data: doc, status: "Community created successfully" }))
                } else {
                    res.send(responseMessageCreator("Error occured while creating community"))
                }
            }).catch((e) => {
                console.log(e)
                res.status(500).send(responseMessageCreator("Internal error occured", 0))
            })
        }
    }
    else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }

}

export const getCommunityUsingId = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["community_id"])

        if (body.community_id == null) {
            res.send(responseMessageCreator("Invalid community id provided", 0))
        } else {
            Community.findOne({
                community_id: body.community_id
            }).then((doc) => {
                res.send(responseMessageCreator({ data: doc }))
            })
        }
    }
    else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const deleteCommunity = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {

        let body = _.pick(req.body, ["community_id"])

        if (body.community_id == null) {
            res.send(responseMessageCreator("Invalid community id provided", 0))
        } else {
            Community.exists({ community_id: body.community_id }).then((result) => {
                if (result) {
                    Community.deleteOne({
                        community_id: body.community_id
                    }).then((d) => {
                        res.send(responseMessageCreator("Deleted community successfully"))
                    }).catch((e) => {
                        console.log(e)
                        res.status(500).send(responseMessageCreator("Internal error occured", 0))
                    })
                }
                else {
                    res.status(400).send(responseMessageCreator("Invalid community id", 0))
                }
            }).catch((err) => {
                console.log(err)
                res.status(400).send(responseMessageCreator("Some error occured", 0))
            })
        }
    }
    else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }

}

export const addUserToPrivateCommunity = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["user_email", "community_id"])

        if (body.user_email != null && validateEmail(body.user_email)) {
            User.exists({
                email: body.user_email
            }).then((result) => {
                if (result) {
                    User.findOne({
                        email: body.user_email
                    }).then((doc) => {
                        if (doc) {
                            Community.exists({
                                community_id: body.community_id,
                                "users_list.user_id": doc.user_id
                            }).then((res2) => {
                                if (!res2) {
                                    Community.findOneAndUpdate({
                                        community_id: body.community_id
                                    }, {
                                        $push: {
                                            users_list: {
                                                user_id: doc.user_id,
                                                user_role: Role.FOLLOWER,
                                                joined_on: Date.now()
                                            }
                                        }
                                    }).then((doc) => {
                                        if (doc) {
                                            res.send(responseMessageCreator("Successfully added user"))
                                        } else {
                                            res.send(responseMessageCreator("Some error occured", 0))
                                        }
                                    })
                                } else {
                                    res.send(responseMessageCreator("User has already joined community", 0))
                                }
                            }).catch((e) => {
                                res.status(400).send(responseMessageCreator("Some error occured", 0))
                            })

                        } else {
                            res.send(responseMessageCreator("Invalid user email", 0))
                        }
                    })
                } else {
                    res.send(responseMessageCreator("Invalid user email", 0))
                }
            })

        } else {
            res.send(responseMessageCreator("Invalid user email", 0))

        }
    }
    else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}


export const removeUserFromCommunity = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["user_id", "community_id"])

        if (body.user_id != null) {
            Community.exists({
                community_id: body.community_id,
                "users_list.user_id": body.user_id,
                "users_list.user_role": Role.FOLLOWER
            }).then((result) => {
                if (result) {
                    Community.findOneAndUpdate({
                        community_id: body.community_id
                    }, {
                        $pull: {
                            users_list: {
                                user_id: body.user_id
                            }
                        }
                    }).then((doc) => {
                        if (doc) {
                            res.send(responseMessageCreator("Successfully added user"))
                        } else {
                            res.send(responseMessageCreator("Some error occured", 0))
                        }
                    })
                } else {
                    res.send(responseMessageCreator("No user found with given credentials", 0))
                }
            }).catch((e) => {
                res.status(400).send(responseMessageCreator("Invalid user", 0))
            })
        } else {
            res.send(responseMessageCreator("Invalid user id", 0))
        }
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const followPublicCommunity = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["community_id"])

        if (body.community_id == null) {
            res.send(responseMessageCreator("Invalid community id", 0))
        } else {
            Community.exists({
                community_id: body.community_id,
                community_mode: CommunityMode.PUBLIC
            }).then((result) => {
                if (result) {
                    Community.findOneAndUpdate({
                        community_id: body.community_id
                    }, {
                        $push: {
                            users_list: {
                                user_id: req.user.user_id,
                                user_role: Role.FOLLOWER,
                                joined_on: Date.now()
                            }
                        }
                    }).then((doc) => {
                        if (doc) {
                            res.send(responseMessageCreator("Successfully added user"))
                        } else {
                            res.send(responseMessageCreator("Some error occured", 0))
                        }
                    }).catch((e) => {
                        console.log(e)
                        res.status(400).send(responseMessageCreator("Some error occured", 0))
                    })
                } else {
                    res.send(responseMessageCreator("Invalid community credentials", 0))
                }
            })
        }
    }
    else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const unfollowCommunity = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["community_id"])

        if (body.community_id == null) {
            res.send(responseMessageCreator("Invalid community id", 0))
        } else {
            Community.exists({
                community_id: body.community_id,
                "users_list.user_id": req.body.user_id,
                $and: [
                    { $or: [{ "users_list.user_role": Role.FOLLOWER }] },
                    { $or: [{ "users_list.user_role": Role.MODERATOR }] }
                ]
            }).then((result) => {
                if (result) {
                    Community.findOneAndUpdate({
                        community_id: body.community_id
                    }, {
                        $pull: {
                            users_list: {
                                user_id: req.user.user_id,
                            }
                        }
                    }).then((doc) => {
                        if (doc) {
                            res.send(responseMessageCreator("Successfully removed user"))
                        } else {
                            res.send(responseMessageCreator("Some error occured", 0))
                        }
                    }).catch((e) => {
                        console.log(e)
                        res.status(400).send(responseMessageCreator("Some error occured", 0))
                    })
                } else {
                    res.send(responseMessageCreator("Invalid community credentials", 0))
                }
            })
        }
    }
    else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const addUserAsModerator = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["community_id", "user_email"])

        if (body.user_email != null && validateEmail(body.user_email)) {
            User.exists({
                email: body.user_email
            }).then((result) => {
                if (result) {
                    User.findOne({
                        email: body.user_email
                    }).then((doc) => {
                        if (doc) {
                            Community.exists({
                                community_id: body.community_id,
                                "users_list.user_id": doc.user_id
                            }).then((res2) => {
                                if (!res2) {
                                    Community.findOneAndUpdate({
                                        community_id: body.community_id
                                    }, {
                                        $push: {
                                            users_list: {
                                                user_id: doc.user_id,
                                                user_role: Role.MODERATOR,
                                                joined_on: Date.now()
                                            }
                                        }
                                    }).then((doc) => {
                                        if (doc) {
                                            res.send(responseMessageCreator("Successfully added user as moderator"))
                                        } else {
                                            res.send(responseMessageCreator("Some error occured", 0))
                                        }
                                    })
                                } else {
                                    Community.findOneAndUpdate({
                                        community_id: body.community_id,
                                        "users_list.user_id": doc.user_id
                                    }, {
                                        "users_list.user_role": Role.MODERATOR
                                    }).then((doc) => {
                                        if (doc) {
                                            res.send(responseMessageCreator("Successfully added user as moderator"))
                                        } else {
                                            res.send(responseMessageCreator("Some error occured", 0))
                                        }
                                    })
                                }
                            }).catch((e) => {
                                res.status(400).send(responseMessageCreator("Some error occured", 0))
                            })

                        } else {
                            res.send(responseMessageCreator("Invalid user email", 0))
                        }
                    })
                } else {
                    res.send(responseMessageCreator("Invalid user email", 0))
                }
            })

        } else {
            res.send(responseMessageCreator("Invalid user email", 0))

        }
    }
    else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}
export const modifyCommunitySettings = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        let body = _.pick(req.body, ["community_id", "community_dp", "community_banner", "about", "rules", "name", "community_mode"])
        let data: any = new Object()
        let isChanged = false

        if (body.community_dp) {
            isChanged = true
            data.community_dp = body.community_dp
        }

        if (body.community_banner) {
            isChanged = true
            data.community_banner = body.community_banner
        }

        if (body.about) {
            isChanged = true
            data.about = body.about
        }

        if (body.rules) {
            isChanged = true
            data.rules = body.rules
        }

        if (body.name) {
            isChanged = true
            data.name = body.name
        }

        if (body.community_mode) {
            isChanged = true
            data.community_mode = body.community_mode
        }

        if (isChanged) {
            Community.exists({
                community_id: body.community_id
            }).then((result) => {
                if (result) {
                    Community.findOneAndUpdate({
                        community_id: body.community_id
                    }, {
                        ...data
                    }).then((doc) => {
                        if (doc) {
                            res.send(responseMessageCreator("Details updated successfully"))
                        } else {
                            res.status(400).send(responseMessageCreator("Some error occured", 0))
                        }
                    }).catch((e) => {
                        console.log({ e })
                        res.status(400).send(responseMessageCreator("Some error occured", 0))
                    })
                } else {
                    res.status(400).send(responseMessageCreator("Invalid community id", 0))
                }
            })
        } else {
            res.status(400).send(responseMessageCreator("Invalid query", 0))
        }
    }
    else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}


// export const s = (req: Request, res: Response) => {
//     let version = req.params.version
//     if (version == "v1") {  

//     }
//     else {
//         res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
//     }
// }

export default {
    createCommunity,
    getCommunityUsingId,
    deleteCommunity,

    addUserToPrivateCommunity,
    removeUserFromCommunity,

    followPublicCommunity,
    unfollowCommunity,

    addUserAsModerator,

    modifyCommunitySettings
}