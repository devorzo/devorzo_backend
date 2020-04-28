import { Schema, model } from "mongoose"
// import { v4 } from "uuid"
import { ICommunityDocument, ICommunity, ICommunityModel } from "../../interfaces/databaseInterfaces"


const CommunitySchema: Schema = new Schema({
    rules: {
        type: String,
        // required
    },

    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    about: {
        type: String,
        required: true
    },

    created_on: {
        type: Number,
        required: true,
        default: Date.now()
    },

    followers_list: [{
        user_uuid: {
            type: String,
            required: true
        },
        followed_on: {
            type: Number,
            default: Date.now(),
            required: true
        }
    }],

    moderator_list: [{
        user_uuid: {
            type: String,
            required: true
        },
        joined_on: {
            type: Number,
            default: Date.now(),
            required: true
        }
    }],

    banned_user:[{
        user_uuid: {
            type: String,
            required: true,
            minlength:1
        },
        banned_on:{
            type: Number,
            required: true,
            default: Date.now()
        }
    }]
})

export const Community: ICommunityModel = model<ICommunity, ICommunityModel>("Community", CommunitySchema)

export default Community