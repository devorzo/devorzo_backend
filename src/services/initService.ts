// eslint-disable-next-line no-unused-vars
import express from "express"
import logger from "../lib/logger"
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
        if(name in this.serviceCache){
            logger({name, i: this.serviceCache[name]})
            this.services[this.serviceCache[name]].serviceApp(this.app)
            logger(`Starting ${this.services[this.serviceCache[name]].serviceName}`)
        }else{
            logger(`Service with name ${name} dosent exist!`)
        }
    }


    serviceInit(name: string | string[]) {
        if (typeof name == "string") {
            if(name =="all"){
                this.startAllServices()
            }else{
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


// let Service = {
//     All: () => {
//         return 1;
//     }
// }

// let addService = (serviceName, location) => {
//     Service[serviceName] = require(location);
// }

// addService("reactService", "./micros/reactService");;
// addService("userAuthService", "./micros/userAuthService");

// export default {
//     Service,
//     serviceInit: (app, service = 1) => {
//         // console.log({ "service from init": service });
//         (service.length)?((service[0]=='all')?(service = 1):null):null;
//         if (service == Service.All() || service.length == 0 || service.length == undefined) {
//             for (var s in Service) {
//                 if (Service.hasOwnProperty(s)) {
//                     if (s != 'All') {
//                         console.log(`Initialising Service \`${s}\``);
//                         Service[s](app);
//                         console.log(`Starting Service \`${s}\``);
//                     }
//                 } else {
//                     console.log(`Initialization of service \`${s}\` failed!`);
//                 }
//             }
//         } else {
//             for (let i = 0; i < service.length; i++) {
//                 let s = service[i].trim();

//                 if (Service.hasOwnProperty(s) && s in Service) {
//                     console.log({ s: s, b: s in Service });
//                     Service[s](app);
//                     console.log(`Initialising Service \`${s}\``);
//                 } else {
//                     console.log(`Initialisation of service \`${s}\` failed!`);
//                 }
//             }
//         }
//     },
//     addService
// }

