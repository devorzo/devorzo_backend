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
import { Mongoose, Query, Types} from "mongoose"
import Community from "../../database/models/communities"
import User from "../../database/models/user"
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

export const deleteCommunity = (req : Request, res: Response) => {
    let version = req.params.version
    if(version == "v1"){
        if (!Object.prototype.hasOwnProperty.call(req.body, "id")){
            res.status(400).send(responseMessageCreator({message:"Please provide the id of the community to be deleted"}, 0))
            return
        }                  
        let id = req.body.id
        if (!Types.ObjectId.isValid(id)){
            res.status(400).send(responseMessageCreator("Argument passed in must be a single String of 12 bytes or a string of 24 hex characters", 0))
            return
        }
        Community.exists({_id:id}).then((result) => {
            if (result) {
                Community.deleteMany({_id:id}, (err) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send(responseMessageCreator("Internal Server Error!", 0))                      
                    }
                    else {
                        res.status(200).send(responseMessageCreator("Community deleted Sucessfully!", 1))
                    }            
                })
            }
            else {
                res.status(404).send(responseMessageCreator("No Such Community!", 0))
            }
        }).catch((err)=>{
            console.log(err)
            res.status(500).send(responseMessageCreator("Internal Server Error!", 0))
        })
    }
    else{
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }

}

export const modifyCommunityDetails = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1"){

    }   
    else{
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const setCommunityRules = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1"){
        if (!Object.prototype.hasOwnProperty.call(req.body, "id")){
            res.status(400).send(responseMessageCreator("Please provide the id of the community!", 0))
            return
        }
        if (!Object.prototype.hasOwnProperty.call(req.body, "rules")){
            res.status(400).send(responseMessageCreator("Please provide the rules for that community!", 0))
            return
        }
        let id = req.body.id
        let rules = req.body.rules
        if (!Types.ObjectId.isValid(id)){
            res.status(400).send(responseMessageCreator("Invalid Id provided", 0))
            return
        }
        if (rules.length == 0){
            res.status(400).send(responseMessageCreator("Provide Some rules", 0))
            return
        }
        Community.exists({_id:id}).then((result)=>{
            if (result){
                Community.findByIdAndUpdate(id,{"rules":rules}).then((result) => {
                    res.status(200).send(result)
                }).catch((err)=>{
                    res.status(500).send(responseMessageCreator("Internal Server Error!", 0))
                    console.log(err)
                })
            }
            else{
                res.status(404).send(responseMessageCreator("No Such Community!", 0))
            }
        }).catch((err)=>{
            res.status(500).send(responseMessageCreator("Internal Server Error!", 0))
            console.log(err)
        })

    }   
    else{
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}
export const setCommunityAbout = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1"){
        if (!Object.prototype.hasOwnProperty.call(req.body, "id")){
            res.status(400).send(responseMessageCreator("Please provide the id of the community!", 0))
            return
        }
        if (!Object.prototype.hasOwnProperty.call(req.body, "about")){
            res.status(400).send(responseMessageCreator("Please tell us about that community!", 0))
            return
        }
        let id = req.body.id
        let about = req.body.about
        if (!Types.ObjectId.isValid(id)){
            res.status(400).send(responseMessageCreator("Invalid Id provided", 0))
            return
        }
        if (about.length == 0){
            res.status(400).send(responseMessageCreator("Provide Something in about", 0))
            return
        }
        Community.exists({_id:id}).then((result)=>{
            if (result){
                Community.findByIdAndUpdate(id,{"about":about}).then((result) => {
                    res.status(200).send(result)
                }).catch((err)=>{
                    res.status(500).send(responseMessageCreator("Internal Server Error!", 0))
                    console.log(err)
                })
            }
            else{
                res.status(404).send(responseMessageCreator("No Such Community!", 0))
            }
        }).catch((err)=>{
            res.status(500).send(responseMessageCreator("Internal Server Error!", 0))
            console.log(err)
        })
    }   
    else{
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}
export const setCommunitySettings = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1"){
        
    }   
    else{
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}

export const addUserToCommunity = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1"){
        if (!Object.prototype.hasOwnProperty.call(req.body, "community_id" )|| !Types.ObjectId.isValid(req.body.community_id)){
            res.status(400).send(responseMessageCreator("Community id not provided or incorrect community id", 0))
            return
        }
        if (!Object.prototype.hasOwnProperty.call(req.body, "user_id") || !Types.ObjectId.isValid(req.body.user_id)){
            res.status(400).send(responseMessageCreator("User id not provided or incorrect User id", 0))
            return
        }
        let community_id = req.body.community_id
        let user_id = req.body.user_id
        Community.findById(community_id).then((doc)=>{
            if (doc){
                return doc 
            }          
            else{
                return null
            }
        }).then((community)=>{
            if (community){
                // User.exists({user_uuid:user_id}).then((userExists)=>{
                //     if (userExists){
                Community.find({"followers_list.user_uuid":user_id, "_id":community_id}).then((result)=>{
                    if (result.length){
                        res.status(400).send(responseMessageCreator("Already a follower to this community!", 0))
                    }
                    else{
                        community.followers_list.push({user_uuid:user_id, followed_on:Date.now()})
                        community.save().then((result)=>{
                            res.status(200).send(responseMessageCreator("User Added Successfully", 1))
                        }).catch((err)=>{
                            res.status(500).send(responseMessageCreator("Internal Server Error!", 0))
                            console.log(err)
                        })
                    }
                })
                // }
                // else{
                //     res.status(400).send(responseMessageCreator("No such User Exists", 0))
                // }
            // })
            }
            else{
                res.status(400).send(responseMessageCreator("No Such community!", 0))
            }
        }).catch((err)=>{
            res.status(500).send(responseMessageCreator("Internal Server Error", 0))
            console.log(err)
        })
    }   
    else{
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}



export default{
    createCommunity,
    deleteCommunity,
    setCommunityRules,
    setCommunityAbout,
    addUserToCommunity
}