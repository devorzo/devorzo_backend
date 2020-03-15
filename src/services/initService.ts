// eslint-disable-next-line no-unused-vars
import express from "express"
import logger, { Level } from "../lib/logger"
class Services {
    All = 1
    app: any
    services: {
        serviceName: string;
        serviceApp: any;
    }[]

    serviceCache: {
        [key: string]: number;
    }
    constructor(app: express.Application) {
        this.app = app
        this.services = []
        this.serviceCache = {}
    }

    addService(serviceName: string, service: any) {
        this.services.push({
            serviceName,
            serviceApp: service
        })
        this.serviceCache[serviceName] = this.services.length - 1
    }

    startAllServices() {
        for (let i = 0; i < this.services.length; i++) {
            this.services[i].serviceApp(this.app)
            logger(`Starting ${this.services[i].serviceName}`)
        }
    }

    startService(name: string) {
        if (name in this.serviceCache) {
            logger({ name, i: this.serviceCache[name] },Level.VERBOSE)
            this.services[this.serviceCache[name]].serviceApp(this.app)
            logger(`Starting ${this.services[this.serviceCache[name]].serviceName}`)
        } else {
            logger(`Service with name '${name}' dosent exist!`,Level.ERROR)
        }
    }


    serviceInit(name: string | string[]) {
        logger({name},Level.VERBOSE)

        if (typeof name == "string") {
            if (name === "all") {
                this.startAllServices()
            } else {
                this.startService(name)
            }
        } else if (Array.isArray(name) && name.length > 0) {
            for (let j = 0; j < name.length; j++) {
                this.startService(name[j])
            }
        }
    }

}

export default Services