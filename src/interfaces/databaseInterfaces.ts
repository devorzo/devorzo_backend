// eslint-disable-next-line no-unused-vars
import mongoose, {Schema, Document, Model, Types, model} from "mongoose"
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
  };
  github_id: number;
  twitter_id: number;
  user_id: string;

  account_created_on: number;

  account_initialised: number;
  email_verified: number;

  password: string;

  tokens: {
    access: string;
    token: string;
  }[];
  bookmarks: {
    article_id: string;
    bookmarked_on: number;
  }[];
  history: {
    atricle_id: string;
    viewed_on: number;
  }[];
  //article relations
}

export interface IUser extends IUserDocument {
  // methods here!
  toJSON(): {_id: Types.ObjectId; email: string};
  generateAuthToken(): Promise<any>;
  generateVerifyToken(): any;
  generateResetToken(): any;

  removeAllVerificationToken(): any;
  removeAllResetToken(): any;
  removeAllAuthToken(): any;
}

export interface IUserModel extends Model<IUser> {
  // statics here
  removeAuthToken(token: any): any;
  findByCredentials(email: string, password: string): any;
  isUsernameUnique(username: string): any;
  accountExists(email: string): any;
  findByToken(token: any, access: string): any;
}

// User Follower Schema
export interface IUserFollowDocument extends Document {
  user_id: string;
  followers: {
    follower_id: string;
    followed_on: number;
  }[];
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

  edited: number;
  last_edited_on: number;
  created_on: number;

  author_id: string;
  article_id: string;
  article_banner: string;
  views: number;

  article_type: number;

  community_id: string;
  belongs_to_community: number; //0|1

  moderation_status: number; //0|1

  //change later
  duration_of_article: string;

  likes: {
    user_id: string;
    liked_on: number;
  }[];
  comments: {
    comment_id: string;
    user_id: string;
    comment: string;
    commented_on: number;
  }[];
  tags: {
    tag: string;
    added_on: number;
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
  community_id: string;
  community_mode: number;

  community_dp: string;
  community_banner: string;
  name: string;
  about: string;

  created_on: number;

  article_list: {
    article_id: string;
    created_on: string;
  }[];

  // followers_list: {
  //     user_id: string;
  //     followed_on: number;
  // }[]

  // moderator_list: {
  //     user_id: string;
  //     joined_on: number;
  // }[]

  users_list: {
    user_id: string;
    user_role: number;
    joined_on: number;
    banned_on: number;
  }[];

  // invite_list: {
  //     user_id: string;
  //     invited_on: number;
  //     status: number;
  // }[]

  // banned_user: {
  //     user_id: string;
  //     // temp ban: cant see comm
  //     // ban: see but cant post
  //     // permanent ban: cant see cant post infinity
  //     // suspension: see but cant post till time t
  //     // ban_type: number;
  //     banned_on: number;
  //     // banned_duration: number;
  // }[]

  // make recommendation engine
}

export interface ICommunity extends ICommunityDocument {
  //statics
}

export interface ICommunityModel extends Model<ICommunity> {
  //methods
}

// Invite code schema
export interface IUserInviteDocument extends Document {
  email: string;
  invite_code: string;
  invited_on: number;
  status: number;
}

export interface IUserInvite extends IUserInviteDocument {
  //statics here
}

export interface IUserInviteModel extends Model<IUserInvite> {
  // methods here
}
