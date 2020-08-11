import { Schema, model } from "mongoose"
import validator from "validator"
// eslint-disable-next-line no-unused-vars
import { IUserInvite, IUserInviteDocument, IUserInviteModel } from "../../interfaces/databaseInterfaces"

// eslint-disable-next-line no-unused-vars
export enum Status { REQUESTED, INVITED, ACCEPTED, BANNED }
const InviteSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "{VALUE} is not a valid email"
        }
    },
    invite_code: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        unique: true
    },
    invited_on: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true,
        default: Date.now()
    },
    status: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true,
        default: Status.REQUESTED
    }

})


export const Invite: IUserInviteModel = model<IUserInvite, IUserInviteModel>("Invite", InviteSchema)

export default Invite