import _ from "lodash"
// import User from "../../database/models/user"
// import Followers from "../../database/models/follower"
// import jwt from "jsonwebtoken"
//import "../../database/models/article"
import "../../database/models/communities"
import "../../database/models/user"
import express from "express"

// eslint-disable-next-line no-unused-vars
import { Request, Response } from "express"
import logger, { Level } from "../../lib/logger"
import { responseMessageCreator } from "../../lib/response_message_creator"
import Article from "../../database/models/article"
import { decodeBase64 } from "bcryptjs"
import { Mongoose, Query } from "mongoose"
import Community from "../../database/models/communities"
export const createCommunity = (req : Request, res: Response) => {
    let version = req.params.version
    if(version == "v1")
    {
          if(!req.body.hasOwnProperty("rules"))
          {
             res.send(responseMessageCreator({message : "Please enter the rules for your community!!"},0))
          }
          if(!req.body.hasOwnProperty("name"))
          {
             res.send(responseMessageCreator({message : "Please enter the name of your community!!"},0))
          }
          if(!req.body.hasOwnProperty("about"))
          {
             res.send(responseMessageCreator({message : "Please enter the description for your community!!"},0))
          }
          if(req.body.name > 150)
          {
              res.send(responseMessageCreator({message : "The name is too long!!!"},0))
          }
          let CommunityNew = {
            "name"  : req.body.name,
            "rules"  :req.body.rules,
            "about" : req.body.about,
            
        }
        let NewCommunityInstance = new Community(CommunityNew)
        console.log(NewCommunityInstance)
        NewCommunityInstance.save(function(err,doc){
            if(err) console.log(err)
            console.log("Community saved in database successfully")

        })
        res.send(responseMessageCreator({message: "Hey, your community is created!!!!!"},1))
    }
    else{
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }

}

export default{
    createCommunity
}