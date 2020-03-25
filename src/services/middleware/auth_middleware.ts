/* eslint-disable no-unused-vars */
import User from "../../database/models/user"
// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from "express"
import logger, { Level } from "../../lib/logger"
// import { Request } from "../../interfaces/express"


export enum Auth {
    "IS_LOGGED_IN",
    "IS_LOGGED_OUT",
    "CHECK_AUTH"
}

export const auth_middleware = (req: Request, res: Response, next: NextFunction, auth_mode = Auth.IS_LOGGED_IN) => {
    let token: any
    if (req.header)
        token = req.header("x-auth")
    // if (!token) {
    //     token = req.query.xAuthToken
    // }
    if (!token) {
        token = req.body.xAuthToken
    }
    if (!token) {
        if (req.session)
            token = req.session.xAuth
    }

    if (token) {
        User.findByToken(token).then((user: any) => {
            if (!user) {
                return Promise.reject()
            }
            if (auth_mode == Auth.IS_LOGGED_IN) {
                req.user = user.toJSON()
                req.token = token
                next()
            }
            else if (auth_mode == Auth.IS_LOGGED_OUT) {
                res.status(401).send({ success: false, error: { message: "AUTH EXISTS" } })
            } else if (auth_mode == Auth.CHECK_AUTH) {
                req.user = user.toJSON()
                req.token = token
                next()
            }

        }).catch((e: any) => {
            logger({ e }, Level.ERROR)

            if (auth_mode == Auth.IS_LOGGED_IN) {
                res.status(401).send({ success: false, error: { message: "INVALID AUTH" } })
            }
            else if (auth_mode == Auth.IS_LOGGED_OUT) {
                req.user = null
                req.token = null
                next()
            } else if (auth_mode == Auth.CHECK_AUTH) {
                req.user = null
                req.token = null
                next()
            }
        })
    } else {

        if (auth_mode == Auth.IS_LOGGED_IN) {
            res.status(401).send({ success: false, error: { message: "INVALID AUTH" } })
        }
        else if (auth_mode == Auth.IS_LOGGED_OUT) {
            req.user = null
            req.token = null
            next()
        } else if (auth_mode == Auth.CHECK_AUTH) {
            req.user = null
            req.token = null
            next()
        }
    }
}

export default auth_middleware