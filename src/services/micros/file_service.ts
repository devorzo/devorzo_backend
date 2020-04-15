// eslint-disable-next-line no-unused-vars
import express, { Request, Response, NextFunction } from "express"
import { v4 } from "uuid"
// import { Request, Response } from "../../interfaces/express"


import { GridFSBucket, ObjectID } from "mongodb"
import multer from "multer"
import GridFSStorage from "multer-gridfs-storage"
import logger, { Level } from "../../lib/logger"
// logger({ monogo: process.env.MONGODB_URI })

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
    router.get("/file-service,", (req, res) => {
        res.send({ status: 200 })
    })
    
    router.post("/upload", upload.single("file"), function (req, res) {
        logger({ file: req.file }, Level.DEBUG)
        res.send({ success: true, file: req.file })
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

    router.get("/del/:id", (req, res) => {
        const bucket = new GridFSBucket(storage.db)
        bucket.delete(new ObjectID(req.params.id), err => {
            if (err) {
                if (err.message.startsWith("FileNotFound")) {
                    res.status(404).send({ success: false, err: err.message })
                
                    return
                }
                return res.status(500).send(err)
            }

            res.status(204).send({ success: false, status: 204, message: "File deleted!" })
        })
    })



    app.use(router)
}

export default fileService