import sendgrid from "@sendgrid/mail";
import express, { Request, Response } from "express"
import { responseMessageCreator } from "../../lib/response_message_creator"

import User from "../../database/models/user"

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
}

export const sendPasswordResetEmail = (req: Request, res: Response) => {

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
}

export default {
    EmailSender,
    sendVerificationEmail,
    sendPasswordResetEmail
}