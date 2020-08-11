// imports
import minimist from "minimist"
import { initEnv } from "./config/config"
import express from "express"
// import "ejs"
import cors from "cors"
import helmet from "helmet"
// import path from "path"
import bodyParser from "body-parser"

import initDb from "./database/mongoose"
import session from "express-session"
import { default as connectMongoDBSession } from "connect-mongodb-session"
import { v4 as uuid } from "uuid"

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

import userApiService from "./services/micros/user_api_service"
import notificationApiService from "./services/micros/notification_service"

import logger, { Level } from "./lib/logger"
import getServiceNames from "./lib/gather_service_names"
import { responseMessageCreator } from "./lib/response_message_creator"

logger({ argv }, Level.VERBOSE)

let app = express()

let whitelist = require("../whitelist.json")

let corsOptionsDelegate = function (req: any, callback: any) {
    let corsOptions
    console.log(req.header("Origin"), whitelist.indexOf(req.header("Origin")))
    if (whitelist.indexOf(req.header("Origin")) !== -1) {
        corsOptions = { origin: true }
    } else {
        corsOptions = { origin: false }
    }
    callback(null, corsOptions)
}

app.use(helmet())
if (process.env.NODE_ENV == "development") app.use(cors())
else {
    app.use((req, res, next) => {
        if (
            whitelist.indexOf(req.header("Origin")) !== -1 &&
      process.env.ENABLE_RFC1918
        ) {
            res.append("Access-Control-Allow-External", "true")
        }
        next()
    })
    app.use(cors(corsOptionsDelegate))
}

/*  Database handlers */
// eslint-disable-next-line no-unused-vars
initDb()

const MongoDBStore = connectMongoDBSession(session)

/* body parser */
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        parameterLimit: 100000,
        extended: true,
    })
)
app.use(
    bodyParser.json({
        limit: "50mb",
    })
)

/* Session */
app.use(
    session({
        secret: uuid(),
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
        store: new MongoDBStore({
            uri: process.env.MONGODB_URI!,
            collection: "sessions",
        }),
    })
)

/* view engine */
// app.use(express.static(path.join(__dirname, "../") + "/build"))

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
s.addService("ui-service", uiService)
s.addService("user-service", userApiService)
s.addService("notification-service", notificationApiService)

let serviceNames = getServiceNames(argv.service)
s.serviceInit(serviceNames)
logger({ serviceNames }, Level.VERBOSE)

app.set("port", process.env.PORT || 5000)

app.get("/", (req, res) => {
    res.send({
        version: process.env.VERSION,
    })
})

app.get("/load", (req, res) => {
    let mem = process.memoryUsage()
    res.send({
        memory: {
            rss: mem.rss / (1024 * 1024),
            heapTotal: mem.heapTotal / (1024 * 1024),
            heapUsed: mem.heapUsed / (1024 * 1024),
            external: mem.external / (1024 * 1024),
        },
    })
})

// res.sendFile(path.join(__dirname + '/client/public/index.html'));

app.get("*", (req, res) => {
    res.status(404).send(responseMessageCreator("Bad Request", 0))
})

app.listen(app.get("port"), process.env.IP!, function () {
    logger(`Server started at ${app.get("port")}`, Level.INFO)
    logger(`env: ${process.env.NODE_ENV}`)
})
