
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
export interface IUserFollowDocument extends Document {
    user_uuid: string;
    followers: {
        follower_uuid: string;
        followed_on: number;
    }[]
}

export interface IUserFollow extends IUserFollowDocument {
    //statics here
}

export interface IUserFollowModel extends Model<IUserFollow> {
    // methods here
}

export interface IArticleDocument extends Document {
    //schema
    title: string;
    content: string;
    preview: string;

    created_on: number;

    author_uuid: string;
    article_uuid: string;

    views: number;

    community_uuid: string;
    belongs_to_community: number; //0|1

    moderation_status: number; //0|1

    //change later
    duration_of_article: string;

    likes: {
        user_uuid: string;
        liked_on: number;
    }[];
}

export interface IArticle extends IArticleDocument {
    // statics
}

export interface IArticleModel extends Model<IArticle> {
    // methods
}

export interface ICommunityDocument extends Document {
    //schema
    //todo: change later
    rules: string;

    name: string;
    about: string;

    created_on: number;

    article_list: {
        article_uuid: string;
        created_on: string;
    }[];

    followers_list: {
        user_uuid: string;
        followed_on: number;
    }[]

    moderator_list: {
        user_uuid: string;
        joined_on: number;
    }[]

    banned_user: {
        user_uuid: string;
        // temp ban: cant see comm
        // ban: see but cant post
        // permanent ban: cant see cant post infinity
        // suspension: see but cant post till time t
        // ban_type: number;
        banned_on: number;
        // banned_duration: number;
    }[]

    // make recommendation engine
}

export interface ICommunity extends ICommunityDocument {
    //statics
}

export interface ICommunityModel extends Model<ICommunity> {
    //methods
}

