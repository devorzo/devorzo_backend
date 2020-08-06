// eslint-disable-next-line no-unused-vars
import mongoose, { Schema, Document, Model, Types, model } from "mongoose"
import validator from "validator"
import jwt from "jsonwebtoken"
import _ from "lodash"
import bcrypt from "bcryptjs"
import { v4 as uuid } from "uuid"
import { generateHexString } from "../../lib/hex_rand"

// eslint-disable-next-line no-unused-vars
import { IUserDocument, IUser, IUserModel } from "../../interfaces/databaseInterfaces"
// eslint-disable-next-line no-unused-vars
import logger from "../../lib/logger"

// logger(generateHexString(128))

enum Gender {
    "MALE" = 0,
    "FEMALE" = 1,
    "OTHER" = 2,
    "NOT_SPECIFIED" = -1
}

enum AccountType {
    "NORMIE" = 0,
    "MODERATOR" = 1,
    "ADMIN" = 2
}
const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "{VALUE} is not a valid email"
        }
    },

    details: {
        fullname: {
            type: String,
            required: true,
            default: `${generateHexString(128)}`,
            trim: true,
            minlength: 1,
        },
        username: {
            type: String,
            unique: true,
            default: `${generateHexString(128)}`,
            required: true,
            trim: true,
            minlength: 1,
        },
        profile_image_link: {
            type: String,
            default: `https://avatars.dicebear.com/v2/identicon/${uuid()}.svg`,
            required: true,
            trim: true,
            minlength: 1,
        },
        user_bio: {
            type: String,
            default: "",
            // required: true,
            trim: true,
            // minlength: 0,
        },
        account_type: {
            type: Number,
            default: AccountType.NORMIE,
            required: true,
            minlength: 1,
            maxlength: 12
        },
        gender: {
            type: Number,
            default: Gender.NOT_SPECIFIED,
            required: true,
            minlength: 1,
            maxlength: 12
        },
    },
    user_id: {
        type: String,
        unique: true,
        default: `user.${uuid()}`,
        required: true,
        trim: true,
        minlength: 1,
    },
    account_created_on: {
        type: Number,
        default: Date.now(),
        required: true,
        minlength: 1,
    },
    account_initialised: {
        type: Number,
        default: 0,
        required: true,
        minlength: 1,
    },
    email_verified: {
        type: Number,
        default: 0,
        required: true,
        minlength: 1,
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    bookmarks: [{
        article_id: {
            type: String,
            required: true
        },
        bookmarked_on: {
            type: Number,
            default: Date.now(),
            required: true
        }
    }],
    history: [{
        article_id: {
            type: String,
            required: true
        },
        visited_on: {
            type: Number,
            default: Date.now(),
            required: true
        }
    }]
})

UserSchema.methods.toJSON = function () {
    let user = this
    let userObject = user.toObject()

    return _.pick(userObject, ["_id", "user_id", "email", "email_verified", "details"])
}

UserSchema.methods.generateAuthToken = function () {
    let user = this
    let access = "auth"
    let token = uuid()
    // let token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET!).toString()
    let signed_token = jwt.sign({ _id: user._id.toHexString(), user_id: user.user_id, token: token, access }, process.env.JWT_SECRET!).toString()

    user.tokens.push({ access, token })

    return user.save().then(() => {
        return signed_token
    })
}

UserSchema.methods.generateVerifyToken = function () {
    let user = this
    let access = "verify"
    let code = generateHexString(8).toUpperCase()
    let token = `${code}`

    user.tokens.push({ access, token })

    return user.save().then(() => {
        return { code, token }
    })
}

UserSchema.methods.generateResetToken = function () {
    let user = this
    let access = "reset"
    let code = generateHexString(8).toUpperCase()
    let token = `${code}`

    user.tokens.push({ access, token })

    return user.save().then(() => {
        return { code, token }
    })
}

UserSchema.methods.removeAllVerificationToken = function () {
    let user = this

    return user.updateOne({
        $pull: {
            tokens: { access: "verify" }
        }
    })
}

UserSchema.methods.removeAllResetToken = function () {
    let user = this

    return user.updateOne({
        $pull: {
            tokens: { access: "reset" }
        }
    })
}

UserSchema.methods.removeAllAuthToken = function () {
    let user = this

    return user.updateOne({
        $pull: {
            tokens: { access: "auth" }
        }
    })
}

UserSchema.statics.removeAuthToken = function (token: any) {
    let user = this

    let decoded: any = jwt.decode(token, { complete: true })

    if (decoded) {
        return user.updateOne({
            $pull: {
                tokens: { token: decoded.token }
            }
        })
    }
}

UserSchema.statics.findByToken = function (token: any, access: string = "auth") {
    let User = this
    let decoded: any

    try {
        if (access == "auth") {
            decoded = jwt.verify(token, process.env.JWT_SECRET! as string)

            return User.findOne({
                "_id": decoded._id,
                "tokens.token": decoded.token,
                "tokens.access": access
            })
        } else {
            console.log("checking verif token")
            return User.findOne({
                "tokens.token": token,
                "tokens.access": access
            })
        }
    } catch (e) {
        console.log("ERROR", e)
        return Promise.reject(e)
    }
}

UserSchema.statics.findByCredentials = function (email: string, password: string) {
    let User = this

    return User.findOne({ email }).then((user: any) => {
        if (!user) {
            return Promise.reject()
        }

        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user)
                } else {
                    reject()
                }
            })
        })
    })
}

UserSchema.statics.isUsernameUnique = function (username: string) {
    let User: IUserModel = this! as IUserModel
    return User.findOne({
        "details.username": username
    }).then((user: any) => {
        if (user) {
            return false
        } else {
            return true
        }
    })
}

UserSchema.statics.accountExists = function (email: string) {
    let User: IUserModel = this! as IUserModel

    return User.findOne({ email }).then((user: any) => {
        if (user) {
            return user
        } else {
            return false
        }
    })
}
UserSchema.pre("save", function (next) {
    let user: any = this

    // User.findOne({ "email": user.email }).then((usr) => {
    //     if (usr) {
    //         console.log(usr)
    //         next(new Error("Account already exists with the given credentials!"));
    //     }
    // });

    if (user.isModified("password")) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }

})


export const User: IUserModel = model<IUser, IUserModel>("User", UserSchema)

export default User
