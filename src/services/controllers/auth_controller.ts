import _ from "lodash"
import User from "../../database/models/user"
import Follower from "../../database/models/follower"

// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from "express"
import logger, { Level } from "../../lib/logger"

export const registerController = (req: Request, res: Response) => {
    // let body: any = _.pick(_.pick(req, ["body"]), ["email", "password", "confpassword"])
    let body = _.pick(req.body, ["email", "password", "confpassword", "session_persistance"])
    // let body = req.body
    logger(req.body, Level.VERBOSE)
    let user = new User(body)
    // if (process.env.REG_MODE == 1) {
    User.accountExists(body.email).then(function (data: any) {
        if (!data) {
            if (body.confpassword == body.password) {
                user.save().then(() => {
                    return user.generateAuthToken()
                }).then((token) => {
                    if (req.session && body.session_persistance) {
                        req.session.xAuth = token
                        req.session.uid = user._id
                        req.session.name = user.email
                    }
                    logger({ user })

                    let follower = new Follower({
                        user_uuid: user.user_uuid
                    })

                    follower.save().then(() => {
                        res.setHeader("x-auth", token)
                        res.send({ success: true, user: user.toJSON(), token })
                    }).catch((e) => {
                        res.setHeader("x-auth", token)
                        res.send({ success: true, user: user.toJSON(), token, status:{
                            success:false,
                            error:{
                                message: `Error creating follower schema Error: ${e}`
                            }
                        } })
                    })


                    // res.redirect('/me');
                    // res.header('x-auth', token).redirect(200, '/me', user);
                }).catch((e) => {
                    let msg = { "msg": e }
                    res.status(400).send({ success: false, error: { message: msg } })
                })
            } else {
                let message = "Passwords do not match!"
                res.status(400).send({ success: false, error: { message } })
            }
        } else {
            let message = "Account already exists with given credentials!"
            res.status(400).send({ success: false, error: { message } })
        }
    })
}


export const loginController = (req: Request, res: Response) => {
    let body = _.pick(req.body, ["email", "password", "session_persistance"])

    User.findByCredentials(body.email, body.password).then((user: any) => {
        return user.generateAuthToken().then((token: any) => {
            if (req.body.cache) {
                if (req.session && body.session_persistance) {
                    req.session.xAuth = token
                    req.session.uid = user._id
                    req.session.name = user.email
                }
                res.setHeader("x-auth", token)
            }
            res.send({ success: true, user: user.toJSON(), token })
            // res.header('x-auth', token).redirect('/me');
        })
    }).catch((e: any) => {
        logger(e, Level.ERROR)
        let message = "Invalid login credentials"
        res.status(400).send({ success: false, error: { message } })
    })
}


export const logoutController = (req: Request, res: Response) => {
    let token = _.pick(req, ["token"])
    User.removeAuthToken(token).then(() => {
        // res.status(200).send();
        if (req.session)
            req.session.destroy(() => { })

        res.status(200).send({ success: true })
    }, () => {
        res.status(400).send({ success: false, error: { message: "Bad Request" } })
    })
}

export default { registerController, loginController, logoutController }