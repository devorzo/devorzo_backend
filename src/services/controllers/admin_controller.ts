import _ from "lodash"
import User from "../../database/models/user"
import Article from "../../database/models/article"
import Followers from "../../database/models/follower"
import Invite, { Status } from "../../database/models/invite_code"

// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from "express"
import logger, { Level } from "../../lib/logger"
import { responseMessageCreator } from "../../lib/response_message_creator"
// import "../../lib/"
import { cleanObject } from "../../lib/clean_object"

export const getAllUsers = (req: Request, res: Response) => {
    let version = req.params.version;
    if (version == "v1") {
        User.find({}).then((doc) => {
            res.send(responseMessageCreator({ data: doc }))
        })
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const getAllInviteRequests = (req: Request, res: Response) => {
    let version = req.params.version;
    if (version == "v1") {
        Invite.find({
            status: Status.REQUESTED
        }).then((doc) => {
            res.send(responseMessageCreator({ data: doc }))
        }).catch((e) => {
            res.status(400).send(responseMessageCreator("Some error occured", 0))
        })
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const getAllRejectedRequests = (req: Request, res: Response) => {
    let version = req.params.version;
    if (version == "v1") {
        Invite.find({
            status: Status.BANNED
        }).then((doc) => {
            res.send(responseMessageCreator({ data: doc }))
        }).catch((e) => {
            res.status(400).send(responseMessageCreator("Some error occured", 0))
        })
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const rejectInviteRequest = (req: Request, res: Response) => {
    let version = req.params.version;
    if (version == "v1") {
        let body = _.pick(req.body, ["email"])

        if (body.email == null) {
            res.send(responseMessageCreator("Invalid email", 0))
        } else {
            Invite.findOne({
                email: body.email
            }).then((doc) => {
                if (doc) {
                    res.send(responseMessageCreator({ data: doc }))
                } else {
                    res.send(responseMessageCreator("Invalid email", 0))
                }
            }).catch((e) => {
                res.send(responseMessageCreator("Some error occured", 0))
            })
        }
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}
// get all invites
// block an invite request

// export const s = (req: Request, res: Response) => {
//     let version = req.params.version;
//     if (version == "v1") {

//     } else {
//         res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
//     }
// }

export default {
    getAllUsers,
    getAllInviteRequests,
    getAllRejectedRequests,
    rejectInviteRequest
}