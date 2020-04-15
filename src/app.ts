// imports
import minimist from "minimist"
import { initEnv } from "./config/config"
import express from "express"
// import "ejs"
import path from "path"
import bodyParser from "body-parser"

import initDb from "./database/mongoose"
import session from "express-session"
import { default as connectMongoDBSession } from "connect-mongodb-session"
import {v4 as uuid } from "uuid"


let argv = minimist(process.argv.slice(2))
initEnv(argv.env)


import Services from "./services/initService"

import adminApiService from "./services/micros/admin_api_service"

import articleApiService from "./services/micros/article_api_service"
import authService from "./services/micros/auth_service"

import communityApiService from "./services/micros/community_api_service"

import moderationApiService from "./services/micros/content_moderation_service"
import suggestionApiService from "./services/micros/content_suggestion_service"

import fileService from "./services/micros/file_service"

// import notificationService from "./services/micros/notification_service"
import uiService from "./services/micros/ui_service"

// import userApiService from "./services/micros/user_api_service"

import logger, { Level } from "./lib/logger"
import getServiceNames from "./lib/gather_service_names"



logger({ argv }, Level.VERBOSE)

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
app.use(express.static(path.join(__dirname, "../") + "/build"))

// app.set("views", path.join(__dirname, "../") + "/views")
// app.set("view engine", "ejs")

/* Services */
let s = new Services(app)
s.addService("admin-api-service", adminApiService)
s.addService("article-api-service", articleApiService)
s.addService("auth-api-service", authService)
s.addService("community-api-service", communityApiService)
s.addService("moderation-api-service", moderationApiService)
s.addService("suggestion-api-service", suggestionApiService)
s.addService("file-service", fileService)
s.addService("article-api-service", articleApiService)
// s.addService("ui-service", uiService)

let serviceNames = getServiceNames(argv.service)
s.serviceInit(serviceNames)
logger({serviceNames}, Level.VERBOSE)


app.set("port", (process.env.PORT || 5000))



// res.sendFile(path.join(__dirname + '/client/public/index.html'));

app.get("*", (req, res) => {
    // console.log("sent from *")
    res.sendFile(path.join(__dirname,"../") + "/build/index.html")
    // res.sendFile(__dirname +".. /build/index.html")
    res.send("404")
})

app.listen(app.get("port"), process.env.IP!, function () {
    logger(`Server started at ${app.get("port")}`,Level.INFO)
    logger(`env: ${process.env.NODE_ENV}`)
})