// imports
import minimist from "minimist"
import { initEnv } from "./config/config"
import express from "express"
import "ejs"
import path from "path"
import bodyParser from "body-parser"

import initDb from "./database/mongoose"
import session from "express-session"
import { default as connectMongoDBSession } from "connect-mongodb-session"
import {v4 as uuid } from "uuid"


let argv = minimist(process.argv.slice(2))
initEnv(argv.env)


import Services from "./services/initService"
import APIService from "./services/micros/api_service"
import authService from "./services/micros/auth_service"
import fileService from "./services/micros/file_service"
import uiService from "./services/micros/ui_service"
import logger, { Level } from "./lib/logger"
import getServiceNames from "./lib/gather_service_names"





// logger({ argv }, Level.WARN)
// logger({ argv }, Level.ERROR)
// logger({ argv }, Level.VERBOSE)
logger({ argv }, Level.VERBOSE)
// logger({ argv }, Level.INFO)



let app = express()

/*  Database handlers */
// eslint-disable-next-line no-unused-vars
let mongoose = initDb()

const MongoDBStore = connectMongoDBSession(session)

/* body parser */
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

/* Session */
app.use(session({
    secret: uuid(),
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: new MongoDBStore({
        uri: process.env.MONGODB_URI!,
        collection: "sessions"
    })
}))

/* view engine */
app.set("views", path.join(__dirname, "../") + "/views")
app.set("view engine", "ejs")

/* Services */
let s = new Services(app)
s.addService("api-service", APIService)
s.addService("auth-service", authService)
s.addService("file-service", fileService)
s.addService("ui-service", uiService)

let serviceNames = getServiceNames(argv.service)
s.serviceInit(serviceNames)
logger({serviceNames}, Level.VERBOSE)


app.set("port", (process.env.PORT || 5000))

app.get("*", (req, res) => {
    // res.sendFile(path.join(__dirname + '/client/public/index.html'));
    res.send("404")
})

app.listen(app.get("port"), process.env.IP!, function () {
    logger(`Server started at ${app.get("port")}`,Level.INFO)
    logger(`env: ${process.env.NODE_ENV}`)
})