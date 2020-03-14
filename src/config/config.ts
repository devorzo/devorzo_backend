// import * as data from "../../env.json"
const data = require("../../env.json")
import {v4 as uuid } from "uuid"
export const initEnv = (env = process.env.NODE_ENV) => {
    env = (env == null) ? "development" : env   
    if (env == "p" || env == "prod"){
        env = "production"
    }else if (env == "d" || env == "dev"){
        env = "production"
    }else if( env == "t"){
        env = "test"
    }
  
    if (env === "development" || env === "test" || env === "production") {
        var config = data
        // console.log(data)
        var envConfig = config[env]
  
        Object.keys(envConfig).forEach((key) => {
            process.env[key] = envConfig[key]
        })
  
        if (env === "production") {
            process.env.JWT_SECRET = uuid()
        }
    } else {
        throw "Invalid Environment!"
    }
    process.env.NODE_ENV = env
    return env
}
  
  
export const makeid = (len = 6) => {
    var text = ""
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789"
    var possible2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ.!@#$%^&*"
  
    for (var i = 0; i < len / 2; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
        text += possible2.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}