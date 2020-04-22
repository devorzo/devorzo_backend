import express from "express"
import fetch from "node-fetch"
import domino from "domino"
const { getMetadata } = require("page-metadata-parser")
// import path from "path"
// import _ from "lodash"

// let reactController = require("../controllers/reactController")
// let { registerController, loginController, logoutController } = require("../controllers/authUserController")
// let { auth, auth_semi } = require("../middlewares/auth")

const uiService = (app: express.Application) => {
    const router = express.Router()



    router.get("/linkToolUrl", (req, res) => {
        console.log({ query: req.query, body: req.body })
        console.log("render")

        const url = req.query.url
        fetch(url).then((doc) => {
            // console
            doc.text().then((d) => {
                const document = domino.createWindow(d).document
                const metadata = getMetadata(document, url)
                // metadata.image = {
                //     url: metadata.image
                // }

                // metadata.icon = {
                //     url: metadata.icon
                // }

                console.log(metadata)
                let { description, keywords, title, language, type, provider } = metadata
                console.log({
                    meta: {
                        description,
                        title,
                        keywords,
                        language,
                        type,
                        provider,
                        image: {
                            url: metadata.image ?? metadata.icon ?? ""
                        }
                    }
                })
                res.send({
                    success: 1, meta: {
                        description,
                        title,
                        keywords,
                        language,
                        type,
                        provider,
                        image: {
                            url: metadata.image ?? metadata.icon ?? ""
                        }
                    }
                })
            })





        }).catch((e) => {
            res.send({ success: 0, e })
        })


        // res.send({ success: false })
        // res.render("index")

    })

    router.post("/ui_upload", (req, res) => {
        console.log({ query: req.query, body: req.body })

        res.send({ success: 0 })
    })

    app.use(router)
}

export default uiService