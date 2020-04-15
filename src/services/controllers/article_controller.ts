import _ from "lodash"
// import User from "../../database/models/user"
// import Followers from "../../database/models/follower"
// import jwt from "jsonwebtoken"
import "../../database/models/article"

// eslint-disable-next-line no-unused-vars
import { Request, Response } from "express"
import logger, { Level } from "../../lib/logger"
import { responseMessageCreator } from "../../lib/response_message_creator"


export const createArticle = (req: Request, res: Response) => {
    let version = req.params.version;
    if (version == "v1") {

    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}


export default {

}
export const s = (req: Request, res: Response) => {
    let version = req.params.version;
    if (version == "v1") {

    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}