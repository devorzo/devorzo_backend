import _ from "lodash"
// import User from "../../database/models/user"
// import Followers from "../../database/models/follower"
// import jwt from "jsonwebtoken"
import "../../database/models/article"
import express from "express"

// eslint-disable-next-line no-unused-vars
import { Request, Response } from "express"
import logger, { Level } from "../../lib/logger"
import { responseMessageCreator } from "../../lib/response_message_creator"
import Article from "../../database/models/article"
import { decodeBase64 } from "bcryptjs"
import { Mongoose, Query } from "mongoose"
export const createArticle = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
        if(!req.body.hasOwnProperty("title"))
        {
            res.send(responseMessageCreator({message: "Please enter the title of your article!!"},0))
        }
        if(!req.body.hasOwnProperty("content"))
        {
            res.send(responseMessageCreator({message: "Please enter the content of your article!!"},0))
        }
        if(req.body.title.length > 150)
        {
            res.send(responseMessageCreator({message : "The title is too long!!!"},0))
        }
        
        let ArticleNew = {
            "title"  : req.body.title,
            "content"  :req.body.content,
            "preview" : req.body.content.substring(0,10) + ".....",
            
        }
        let NewArticleInstance = new Article(ArticleNew) // document
        console.log(NewArticleInstance)
        
        NewArticleInstance.save(function(err,doc){
            if (err) return console.log(err)
            console.log("Article is saved in database sucessfully!")
        })
        res.send(responseMessageCreator({message: "Hey, your article is created!!!!!"},1))
    }
    else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}
export const getArticleByUserId = (req: Request, res : Response) =>{
    let version = req.params.version
    if(version == "v1")
    {
        let author_id : string  = req.body.author_uuid
        let query  = Article.find({author_uuid : author_id})
        query.sort("-date")
        let promise  = query.exec(function(err,doc){
            if(err) return console.log(err)
            if(doc.length == 0)
                res.send(responseMessageCreator({message: "Sorry!!! No article by the user"},1))
            else 
                res.send(doc)
        })
      
    }
    else{
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}


export default {
    createArticle,
    getArticleByUserId
}
export const s = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {

    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}