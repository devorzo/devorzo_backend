import { Schema, model } from "mongoose"
import { v4 } from "uuid"
// eslint-disable-next-line no-unused-vars
import { IArticleDocument, IArticle, IArticleModel } from "../../interfaces/databaseInterfaces"

export enum BooleanFlag {
    NO,
    YES,
    NOT_DECIDED = -1
}

export enum ArticleType {
    NORMAL,
    FEATURED
}
export const randNum = (min: number, max: number) => {
    let random = Math.round(Math.random() * (+max - +min) + +min)
    return random
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

    preview: {
        type: String,
        required: true
    },

    edited: {
        type: Number,
        default: BooleanFlag.NO,
        required: true
    },
    last_edited_on: {
        type: Number,
        default: BooleanFlag.NO,
        required: true
    },
    created_on: {
        type: Number,
        default: Date.now(),
        requried: true
    },

    article_id: {
        type: String,
        required: true,
        default: `article.${v4()}`,
        unique: true,
        minlength: 1,
        trim: true
    },
    author_id: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    article_banner: {
        type: String,
        default: `https://i.picsum.photos/id/${randNum(0, 1084)}/1200/200.jpg`,
        required: true,
        trim: true,
        minlength: 1
    },
    views: {
        type: Number,
        default: 0,
        required: true
    },

    article_type: {
        type: Number
    },

    community_id: {
        type: String,
        required: true,
        default: "NA",
        minlength: 1,
        trim: true,
    },

    belongs_to_community: {
        type: Number,
        required: true,
        default: BooleanFlag.NO
    },

    moderation_status: {
        type: Number,
        default: BooleanFlag.NO,
        required: true
    },

    duration_of_article: {
        type: String,
        default: "-1",
    },

    likes: [{
        user_id: {
            type: String,
            required: true
        },
        liked_on: {
            type: Number,
            default: Date.now(),
            required: true
        }
    }],
    comments: [{
        comment_id: {
            type: String,
            default: `cmt.${v4()}`,
            required: true
        },
        user_id: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        commented_on: {
            type: Number,
            default: Date.now(),
            required: true
        }
    }],
    tags: [{
        tag: {
            type: String,
            required: true
        },
        added_on: {
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