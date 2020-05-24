import { Schema, model } from "mongoose"
import { v4 } from "uuid"
import { ICommunityDocument, ICommunity, ICommunityModel } from "../../interfaces/databaseInterfaces"

export enum CommunityMode {
    PUBLIC,
    PRIVATE
}

export enum Status {
    INVITED,
    ACCEPTED
}

export enum Role {
    ADMIN,
    FOLLOWER,
    MODERATOR,
    BANNED
}
const CommunitySchema: Schema = new Schema({
    rules: {
        type: String,
        // required
    },
    community_id: {
        type: String,
        required: true,
        unique: true,
        default: `community.${v4()}`
    },
    community_dp: {
        type: String,
        default: `https://avatars.dicebear.com/v2/identicon/${v4()}.svg`,
        required: true,
        trim: true,
        minlength: 1,
    },
    community_banner: {
        type: String,
        default: `https://avatars.dicebear.com/v2/identicon/${v4()}.svg`,
        required: true,
        trim: true,
        minlength: 1,
    },
    community_mode: {
        type: Number,
        required: true,
        default: CommunityMode.PUBLIC
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

    users_list: [{
        user_id: {
            type: String,
            required: true,
            unique: true
        },
        user_role: {
            type: Number,
            required: true,
            default: Role.FOLLOWER
        },
        joined_on: {
            type: Number,
            required: true,
            default: Date.now()
        },
        banned_on: {
            type: Number
        }
    }],
    // followers_list: [{
    // user_id: {
    //     type: String,
    //     required: true
    // },
    //     followed_on: {
    //         type: Number,
    //         default: Date.now(),
    //         required: true
    //     }
    // }],

    // moderator_list: [{
    //     user_id: {
    //         type: String,
    //         required: true
    //     },
    //     joined_on: {
    //         type: Number,
    //         default: Date.now(),
    //         required: true
    //     }
    // }],

    // banned_user: [{
    //     user_id: {
    //         type: String,
    //         required: true,
    //         minlength: 1
    //     },
    //     banned_on: {
    //         type: Number,
    //         required: true,
    //         default: Date.now()
    //     }
    // }],

    // invite_list: [{
    //     user_id: {
    //         type: String,
    //         required: true,
    //         minlength: 1
    //     },
    //     invited_on: {
    //         type: Number,
    //         required: true,
    //         default: Date.now()
    //     },
    //     status: {
    //         type: Number,
    //         required: true,
    //         default: Status.INVITED
    //     }
    // }]
})

export const Community: ICommunityModel = model<ICommunity, ICommunityModel>("Community", CommunitySchema)

export default Community