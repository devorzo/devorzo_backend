// imports
import minimist from "minimist"
import { initEnv } from "./config/config"
import express from "express"
import bodyParser from "body-parser"
import initDb from "./database/mongoose"
import session from "express-session"
import { default as connectMongoDBSession } from "connect-mongodb-session"
import {v4 as uuid } from "uuid"

import Services from "./services/initService"
import APIService from "./services/micros/api_service"
import authService from "./services/micros/auth_service"
import logger from "./lib/logger"
import getServiceNames from "./lib/gather_service_names"


let argv = minimist(process.argv.slice(2))
logger({ argv })

const env = initEnv(argv.env)
// logger({ process: process.env, env })


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
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

/* Services */
let s = new Services(app)
s.addService("api-service", APIService)
s.addService("auth-service", authService)
// s.startService("auth-service")
let serviceNames = argv.service ? getServiceNames(argv.service) : "all"
logger(serviceNames)
s.serviceInit(serviceNames)


app.set("port", (process.env.PORT || 5000))

app.get("*", (req, res) => {
    // res.sendFile(path.join(__dirname + '/client/public/index.html'));
    res.send("404")
})

app.listen(app.get("port"), process.env.IP!, function () {
    logger(env)
    logger(`Server started at ${app.get("port")}`)
    logger(`env: ${process.env.NODE_ENV}`)
})