import _ from "lodash"
import User from "../../database/models/user"

// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from "express"
import logger, { Level } from "../../lib/logger"

// export const f = (req: Request, res: Response) => {}

export const responseMessageCreator = (success: boolean | number = true, message:any = "message") => {
    let data

    if (success == true || success == 1) {
        data = {
            success: true,
            message
        }
    } else {
        data = {
            success: false,
            error: { message }
        }
    }

    return data
}

export const userDetailsController = (req: Request, res: Response) => {
    let body = _.pick(req.body, ["uuid"])
    logger({ body }, Level.INFO)
    if (body.uuid == null || body.uuid == undefined) {
        res.status(400).send(responseMessageCreator(0, "Bad user uuid"))
    }

    User.findOne({
        user_uuid: body.uuid
    }).then((doc) => {
        let d
        if (doc)
            d = doc.toJSON()
        res.send(responseMessageCreator(1, d))
    }).catch((e) => {
        res.status(400).send(responseMessageCreator(0, e))
    })

}
export default { userDetailsController }