
// eslint-disable-next-line no-unused-vars
import mongoose, { Schema, Document, Model, Types, model } from "mongoose"
export interface IUserDocument extends Document {
    // SCHEMA
    // isAccountInitialised
    email: string;
    details: {
        fullname: string;
        username: string;
        profile_image_link: string;
        user_bio: string;
        account_type: number;
        gender: number;
    }

    user_uuid: string;

    account_created_on: number;
    
    account_initialised: number;
    email_verified: number;

    password: string;
    
    tokens: {
        access: string;
        token: string;
    }[];
    bookmarks: {
        article_uuid: string;
        bookmarked_on: number;
    }[];
    history: {
        atricle_uuid: string;
        viewed_on: number;
    }[];
    //article relations
}

export interface IUser extends IUserDocument {
    // methods here! 
    toJSON(): { _id: Types.ObjectId, email: string }
    generateAuthToken(): any
}

export interface IUserModel extends Model<IUser> {
    // statics here
    removeAuthToken(token: any): any
    findByCredentials(email: string, password: string): any
    accountExists(email: string): any
    findByToken(token: any): any
}


// User Follower Schema
export interface IUserFollowDocument extends Document{
    user_uuid: string;
    followers: {
        follower_uuid: string;
        followed_on: number;
    }[]
}

export interface IUserFollow extends IUserFollowDocument{
    //statics here
}

export interface IUserFollowModel extends Model<IUserFollow>{
    // methods here
}