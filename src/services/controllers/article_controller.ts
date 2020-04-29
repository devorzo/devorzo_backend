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
export const createArticle = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {
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


export default {
    createArticle
}
export const s = (req: Request, res: Response) => {
    let version = req.params.version
    if (version == "v1") {

    } else {
        res.status(400).send(responseMessageCreator("Invalid API version provided!", 0))
    }
}