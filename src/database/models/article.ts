import { Schema, model } from "mongoose"
import { v4 } from "uuid"
// eslint-disable-next-line no-unused-vars
import { IArticleDocument, IArticle, IArticleModel } from "../../interfaces/databaseInterfaces"

export enum BooleanFlag{
    NO,
    YES,
    NOT_DECIDED = -1
}
const ArticleSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    content: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },

    preview:{
        type: String,
        required: true
    },

    created_on: {
        type: Number,
        default: Date.now(),
        requried: true
    },

    article_uuid: {
        type: String,
        required: true,
        default: `article.${v4()}`,
        minlength: 1,
        trim: true
    },
    author_uuid: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        default: `user.${v4()}`
    },

    views: {
        type: Number,
        default: 0,
        required: true
    },

    community_uuid: {
        type: String,
        required: true,
        default: "NONE",
        minlength: 1,
        trim: true,
        //default: `user.${v4()}`
    },

    belongs_to_community:{
        type: Number,
        required: true,
        default: BooleanFlag.NO
    },

    moderation_status:{
        type: Number,
        default:BooleanFlag.NO,
        required: true
    },

    duration_of_article:{
        type:String,
        default: "-1",
    },

    likes: [{
        user_uuid: {
            type: String,
            required: true
        },
        liked_on:{
            type: Number,
            default: Date.now(),
            required: true
        }
    }]

})


// todo: pre save generate
// - duration and preview
    
export const Article: IArticleModel = model<IArticle, IArticleModel>("Article", ArticleSchema)

export default Article