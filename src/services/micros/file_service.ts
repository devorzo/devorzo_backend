// eslint-disable-next-line no-unused-vars
import express, { Request, Response, NextFunction } from "express"
import { v4 } from "uuid"
// import { Request, Response } from "../../interfaces/express"


import { GridFSBucket, ObjectID } from "mongodb"
import multer from "multer"
import GridFSStorage from "multer-gridfs-storage"
import logger, { Level } from "../../lib/logger"
// logger({ monogo: process.env.MONGODB_URI })

import { auth_middleware_wrapper_IS_LOGGED_IN, checkIfUserIsAdmin } from "../middleware/auth_middleware"
import { responseMessageCreator } from "../../lib/response_message_creator"
let opts: GridFSStorage.UrlStorageOptions
opts = {
    url: process.env.MONGODB_URI!,
    file: (req: any, file: any) => {
        let data

        logger({ file })
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/gif" || file.mimetype === "image/png") {
            let ext = file.originalname.split(".")
            ext = ext[ext.length - 1]
            data = {
                filename: `image.${v4()}.${ext}`
                // bucketName: "files"
            }
        } else {
            let ext = file.originalname.split(".")
            ext = ext[ext.length - 1]
            data = {
                filename: `file.${v4()}.${ext}`
                // bucketName: "files"
            }
        }

        return data
    }
}

const storage = new GridFSStorage(opts)

const upload = multer({ storage })

const fileService = (app: express.Application) => {
    const router = express.Router()
    router.get("/api/:version/file-service,", (req, res) => {
        let version = req.params.version;
        if (version == "v1") {
            res.send({ status: 200 })
        } else {
            res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
        }

    })

    router.post("/api/:version/upload", upload.single("file"), function (req, res) {
        let version = req.params.version;
        if (version == "v1") {
            logger({ file: req.file }, Level.DEBUG)
            res.send({ success: true, file_name: req.file.filename, file_info: req.file })
        } else {
            res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
        }
    })

    router.get("/test-upload", (req, res) => {
        res.send(`
            <form action="/upload" method="post" enctype="multipart/form-data">
                <input type="file" name="file" />
                <input type="submit"/>
            </form>
        `)
    })


    router.get("/file/:name", (req, res) => {
        const bucket = new GridFSBucket(storage.db)
        const stream = bucket.openDownloadStreamByName(req.params.name)
        stream.on("error", (err: any) => {
            if (err.code === "ENOENT") {
                res.status(404).send("File not found")
                return
            }

            res.status(500).send({ err })
        })
        stream.pipe(res)
    })

    router.delete("/api/:version/del/:id",
        auth_middleware_wrapper_IS_LOGGED_IN,
        checkIfUserIsAdmin,
        (req, res) => {
            let version = req.params.version;
            if (version == "v1") {
                const bucket = new GridFSBucket(storage.db)
                bucket.delete(new ObjectID(req.params.id), err => {
                    if (err) {
                        if (err.message.startsWith("FileNotFound")) {
                            res.status(404).send({ success: false, err: err.message })

                            return
                        }
                        res.status(500).send(err)

                        return
                    }

                    res.status(200).send({ success: true, message: "File deleted!" })
                })
            } else {
                res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
            }

        })

    router.get("/api/:version/getAllFiles",
        auth_middleware_wrapper_IS_LOGGED_IN,
        checkIfUserIsAdmin,
        (req, res) => {
            let version = req.params.version;
            if (version == "v1") {
                const bucket = new GridFSBucket(storage.db)
                let files = bucket.find({})
                let data: any = []
                files.forEach((file) => {
                    console.log(file)
                    data.push(file)
                }).then(() => {
                    res.send({ success: true, data })
                })
            } else {
                res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
            }
        })

    app.use(router)
}

export default fileService