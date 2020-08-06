import _ from "lodash"
import { v4 as uuid } from "uuid"
import User from "../../database/models/user"
import Follower from "../../database/models/follower"

// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from "express"
import logger, { Level } from "../../lib/logger"

import { responseMessageCreator } from "../../lib/response_message_creator"

export const registerController = (req: Request, res: Response) => {
    // let body: any = _.pick(_.pick(req, ["body"]), ["email", "password", "confpassword"])
    let body = _.pick(req.body, ["email", "fullname", "username", "password", "confpassword", "session_persistance"])
    // let body = req.body


    if (body.email == null || body.fullname == null || body.username == null || body.password == null || body.confpassword == null) {
        let email_arg = (!body.email) ? "'email' " : ""
        let n_arg = (!body.fullname) ? "'fullname' " : ""
        let u_arg = (!body.username) ? "'username' " : ""
        let p_arg = (!body.password) ? "'password' " : ""
        let cp_arg = (!body.password) ? "'confpassword' " : ""

        let m = email_arg.concat(n_arg, u_arg, p_arg, cp_arg)
        res.status(400).send(responseMessageCreator(`Missing required arguments: ${m}`, 0))
    }

    logger(req.body, Level.VERBOSE)
    let user = new User({
        "email": body.email,
        "details": {
            "fullname": body.fullname,
            "username": body.username
        },
        "password": body.password,
        "user_id": `user.${uuid()}`
    })
    // if (process.env.REG_MODE == 1) {
    User.isUsernameUnique(body.username).then(function (isUnique: any) {
        if (isUnique) {
            User.accountExists(body.email).then(function (data: any) {
                if (!data) {
                    if (body.confpassword == body.password) {
                        user.save().then(() => {
                            return user.generateAuthToken()
                        }).then((token) => {
                            // if (req.session && body.session_persistance) {
                            //     req.session.xAuth = token
                            //     req.session.uid = user._id
                            //     req.session.user_id = user.user_id
                            //     req.session.name = user.email
                            //     req.session.logged = true
                            // }
                            logger({ user })

                            let follower = new Follower({
                                user_id: user.user_id
                            })

                            follower.save().then(() => {
                                res.setHeader("x-auth", token)
                                // res.send({ success: true, user: user.toJSON(), token, d })
                                res.send(responseMessageCreator({ user: user.toJSON(), token }, 1))

                            }).catch((e) => {
                                res.setHeader("x-auth", token)
                                res.send({
                                    success: true, user: user.toJSON(), token, status: {
                                        success: false,
                                        error: {
                                            message: `Error creating follower schema Error: ${e}`
                                        }
                                    }
                                })
                            })

                            // res.redirect('/me');
                            // res.header('x-auth', token).redirect(200, '/me', user);
                        }).catch((e) => {
                            console.log(e)
                            let message = "An error occured! Please try again later."
                            res.status(400).send(responseMessageCreator(message, 0))
                        })
                    } else {
                        let message = "Passwords do not match!"
                        res.status(400).send(responseMessageCreator(message, 0))
                    }
                } else {
                    let message = "Account already exists with given credentials!"
                    res.status(400).send(responseMessageCreator(message, 0))
                }
            })
        } else {
            let message = "Username has already been taken! Please choose another username."
            res.status(400).send(responseMessageCreator(message, 0))
        }
    })

}


export const loginController = (req: Request, res: Response) => {
    let body = _.pick(req.body, ["email", "password", "session_persistance", "clear_tokens"])

    User.findByCredentials(body.email, body.password).then((user: any) => {
        if (body.clear_tokens) {
            user.removeAllAuthToken().then(() => {
                return user.generateAuthToken().then((token: any) => {
                    if (req.body.cache) {
                        if (req.session && body.session_persistance) {
                            req.session.xAuth = token
                            req.session.uid = user._id
                            req.session.name = user.email
                        }
                        res.setHeader("x-auth", token)
                    }
                    res.send(responseMessageCreator({ user: user.toJSON(), token }, 1))
                })
            })
        } else {
            return user.generateAuthToken().then((token: any) => {
                if (req.body.cache) {
                    if (req.session && body.session_persistance) {
                        req.session.xAuth = token
                        req.session.uid = user._id
                        req.session.name = user.email
                    }
                    res.setHeader("x-auth", token)
                }
                res.send(responseMessageCreator({ user: user.toJSON(), token }, 1))
            })
        }
    }).catch((e: any) => {
        logger(e, Level.ERROR)
        let message = "Invalid login credentials"
        res.status(400).send(responseMessageCreator(message, 0))
    })
}


export const logoutController = (req: Request, res: Response) => {
    let token = req.token
    let w = User.removeAuthToken(token)

    w.then(() => {
        if (req.session)
            req.session.destroy(() => { })

        res.status(200).send({ success: true })
    }, () => {
        res.status(400).send(responseMessageCreator("Bad Request", 0))
    }).catch(() => {
        res.status(400).send(responseMessageCreator("Bad Request", 0))
    })
}

export const VerifyEmail = (req: Request, res: Response) => {
    let token = req.body.code

    User.findOne({
        email: req.user.email,
        "tokens.token": token.toUpperCase(),
        "tokens.access": "verify"
    }).then(doc => {
        console.log({u: req.user.email, doc, token})
        if (doc) {
            if (doc.email_verified == 1) {
                res.status(400).send(responseMessageCreator("Email is already verified",0))
            } else {
                doc.email_verified = 1
                doc.save().then(() => {
                    doc.removeAllVerificationToken().then(() => {
                        res.send(responseMessageCreator("Email is now verified"))
                    })
                })
            }
        } else {
            res.status(400).send(responseMessageCreator("Invalid Code", 0))
        }
    })
}

// todo: reset password controller
export default {
    registerController,
    loginController,
    logoutController,
    VerifyEmail
}