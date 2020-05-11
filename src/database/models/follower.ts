import { Schema, model } from "mongoose"

// eslint-disable-next-line no-unused-vars
import { IUserFollowDocument, IUserFollow, IUserFollowModel } from "../../interfaces/databaseInterfaces"

const FollowerSchema: Schema = new Schema({
    user_id: {
        type: String,
        required: true,
        minlength: 1,
        trim: true

    },
    followers: [{
        follower_id:{
            type: String,
            required: true,
            minlength:1, 
            trim:true
        },
        followed_on:{
            type: Number,
            default: Date.now(),
            required: true,
            minlength:1
        }
    }]

})


export const Follow: IUserFollowModel = model<IUserFollow, IUserFollowModel>("Follow", FollowerSchema)

export default Follow