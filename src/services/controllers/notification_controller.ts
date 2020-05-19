import sendgrid from "@sendgrid/mail";
import express, { Request, Response } from "express"
import _ from "lodash"
import { responseMessageCreator } from "../../lib/response_message_creator"

import User from "../../database/models/user"
import Invite, {Status} from "../../database/models/invite_code"
import validateEmail from "../../lib/validate_email"
import { generateHexString } from "../../lib/hex_rand"
enum Role {
    verification,
    reset
}

enum Type {
    html,
    text
}
function rotcc13(str: any) {
    var input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
    var output = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm0987654321'
    var index = (x: any) => input.indexOf(x)
    var translate = (x: any) => index(x) > -1 ? output[index(x)] : x
    return str.split('').map(translate).join('')
}

const EmailTemplates = (role = Role.verification, type = Type.html) => {
    let template = ""
    if (role == Role.verification) {
        if (type == Type.html) {
            template = ""
        } else if (type == Type.text) {
            template = ""
        }
    } else if (role == Role.reset) {
        if (type == Type.html) {
            template = ""
        } else if (type == Type.text) {
            template = ""
        }
    }

    return template
}
export const EmailSender = (data: { to: string, from: string, subject: string, text: string, html: string }, callback: any) => {

    var ap1 = "FT";
    var ap2 = "OBEsnUdNExXryjJybYuq4t";
    var ap3 = "r8SJp0fiib41Su5YeYdzSTc76pH0cqWoBPOStbVuM5N";
    var api = ap1 + "." + ap2 + "." + ap3;
    sendgrid.setApiKey(rotcc13(api));

    let { to, from, subject, text, html } = data
    const msg = {
        to,
        from,
        subject,
        text,
        html,
    };

    try {
        sendgrid.send(msg).then(function () {
            callback({ data: msg, success: true })

        }).catch(function (err) {
            console.log(err);
            callback({ error: err, success: false })
        });
        // response.send(msg)
    } catch (err) {
        console.log(err);
    }
}

export const sendVerificationEmail = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        console.log({ user: req.user, t: req.token })

        User.findByToken(req.token, "auth").then((user: any) => {
            // console.log({user})
            user.removeAllVerificationToken().then((d: any) => {
                user.generateVerifyToken().then((doc: any) => {
                    console.log(doc.token)
                    EmailSender({
                        to: req.user.email,
                        from: "noreply@lattice.com",
                        subject: "Verify your email",
                        text: `link: ${doc.t1}/${doc.t2}/${doc.t3}`,
                        html: `link: ${doc.t1}/${doc.t2}/${doc.t3}`
                    }, (doc: any) => {
                        if (doc.success) {
                            res.send(responseMessageCreator("Sent email", 1))
                        } else {
                            res.send(responseMessageCreator("Error", 0))
                        }
                    })

                })
            })
        })
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const sendPasswordResetEmail = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        console.log({ user: req.user, t: req.token })
        User.findByToken(req.token, "auth").then((user: any) => {
            user.removeAllResetToken().then((d: any) => {
                user.generateResetToken().then((doc: any) => {
                    console.log(doc.token)
                    EmailSender({
                        to: req.user.email,
                        from: "noreply@lattice.com",
                        subject: "Reset your password",
                        text: `link: ${doc.t1}/${doc.t2}/${doc.t3}`,
                        html: `link: ${doc.t1}/${doc.t2}/${doc.t3}`
                    }, (doc: any) => {
                        if (doc.success) {
                            res.send(responseMessageCreator("Sent email", 1))
                        } else {
                            res.send(responseMessageCreator("Error", 0))
                        }
                    })

                })
            })
        })
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }


}

export const requestInviteCode = (req: Request, res: Response) => {
    // console.log({ user: req.user, t: req.token })
    let version = req.params.version
    if (version == "v1") {

        let body = _.pick(req.body, ["email"])

        if (body.email != null && validateEmail(body.email)) {
            User.exists({
                email: body.email
            }).then((status) => {
                if (!status) {
                    let token = generateHexString(8).toUpperCase()

                    let i = new Invite({
                        email: body.email,
                        invite_code: token,
                        invited_on: -1,
                        status: Status.REQUESTED
                    })

                    i.save().then(() => {
                        EmailSender({
                            to: body.email,
                            from: "noreply@lattice.com",
                            subject: "Hello!",
                            text: "You invite code will be send out soon!",
                            html: "You invite code will be send out soon!"
                        }, (doc: any) => {
                            if (doc.success) {
                                res.send(responseMessageCreator("Sent email", 1))
                            } else {
                                res.send(responseMessageCreator("Error", 0))
                            }
                        })
                    }).catch((e) => {
                        res.status(200).send(responseMessageCreator("You have already requested invite code", 0))
                    })
                } else {
                    res.status(400).send(responseMessageCreator("Account already exists with given credential", 0))
                }
            })
        } else {
            res.status(400).send(responseMessageCreator("Invalid email", 0))
        }
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const sendInviteEmail = (req: Request, res: Response) => {
    // console.log({ user: req.user, t: req.token })
    let version = req.params.version
    if (version == "v1") {

        let body = _.pick(req.body, ["email"])

        if (body.email != null && validateEmail(body.email)) {
            User.exists({
                email: body.email
            }).then((status) => {
                if (!status) {
                    let token = generateHexString(8).toUpperCase()

                    Invite.findOne({
                        email: body.email
                    }).then((i) => {

                        if (i) {
                            i.invite_code = token
                            i.invited_on = Date.now()
                            i.status = Status.INVITED
                            i.save().then(() => {
                                EmailSender({
                                    to: body.email,
                                    from: "noreply@lattice.com",
                                    subject: "Your Lattice invite code",
                                    text: `Your invite code is ${token}`,
                                    html: `Your invite code is <srong>${token}</strong>`
                                }, (doc: any) => {
                                    if (doc.success) {
                                        res.send(responseMessageCreator("Sent email", 1))
                                    } else {

                                    }
                                })
                            })
                        } else {
                            res.send(responseMessageCreator("Error invalid email", 0))
                        }

                    })
                } else {
                    res.status(400).send(responseMessageCreator("Account already exists with given credential", 0))
                }
            })
        } else {
            res.status(400).send(responseMessageCreator("Invalid email", 0))
        }
    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}


export default {
    EmailSender,
    sendVerificationEmail,
    sendPasswordResetEmail,

    requestInviteCode,
    sendInviteEmail
}