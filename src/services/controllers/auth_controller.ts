import _ from "lodash"
import User from "../../database/models/user"

// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from "express"
import logger from "../../lib/logger"

export const registerController = (req: Request, res: Response) => {
    // let body: any = _.pick(_.pick(req, ["body"]), ["email", "password", "confpassword"])
    let body = _.pick(req.body, ["email", "password","confpassword"])
    // let body = req.body
    logger(req.body)
    let user = new User(body)
    // if (process.env.REG_MODE == 1) {
    User.accountExists(body.email).then(function (data: any) {
        if (!data) {
            if (body.confpassword == body.password) {
                user.save().then(() => {
                    return user.generateAuthToken()
                }).then((token) => {
                    if (req.session) {
                        req.session.xAuth = token
                        req.session.uid = user._id
                        req.session.name = user.email
                    }
                    // logger({user});
                    res.setHeader("x-auth", token)
                    res.send({ success: true, user: user.toJSON(), token })
                    // res.redirect('/me');
                    // res.header('x-auth', token).redirect(200, '/me', user);
                }).catch((e) => {
                    let msg = { "msg": e }
                    res.status(400).send({ success: false, error: msg })
                })
            } else {
                let msg = { "msg": "Passwords do not match!" }
                res.status(400).send({ success: false, error: msg.msg })
            }
        } else {
            let msg = { "msg": "Account already exists with given credentials!" }
            res.status(400).send({ success: false, error: msg.msg })
        }
    })
}


export const loginController = (req: Request, res: Response) => {
    let body = _.pick(req.body, ["email", "password"])
    // logger({ "body": req.body, "query": req.query });

    User.findByCredentials(body.email, body.password).then((user: any) => {
        return user.generateAuthToken().then((token: any) => {
            if (req.body.cache) {
                if (req.session) {
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
        // res.status(400).send("Invalid login credentials");
        logger(e)
        let msg = { "msg": "Invalid login credentials" }
        res.status(400).send({ success: false, error: msg.msg })
    })
}


export const logoutController = (req: Request, res: Response) => {
    let token = _.pick(req, ["token"])
    User.removeAuthToken(token).then(() => {
        // res.status(200).send();
        if (req.session)
            req.session.destroy(()=>{})

        res.redirect("/login")
    }, () => {
        res.status(400).send({ success: false, error: "Bad Request" })
    })
}

export default { registerController, loginController, logoutController }