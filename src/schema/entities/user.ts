import { prop, getModelForClass } from '@typegoose/typegoose';
// import { ObjectId } from 'mongodb';
import { Field, ObjectType } from 'type-graphql';
import validator from 'validator';
import { v4 as uuid } from 'uuid';
import mongoose from 'mongoose';
// import { generateHexString } from '../../lib/hex_rand';

mongoose.Promise = global.Promise;

enum Gender {
  'MALE',
  'FEMALE',
  'OTHER',
  'NOT_SPECIFIED' = -1
}

enum AccountType {
  'NORMIE',
  'MODERATOR',
  'ADMIN'
}

enum Access {
  'AUTH' = 'auth',
  'VERIFY' = 'verify',
  'RESET' = 'reset',
  'GITHUB_ID' = 'github_oauth',
  'TWITTER_ID' = 'twitter_oauth'
}

enum EmailVerified {
  NO,
  YES
}

@ObjectType()
class Token {
  @Field()
  @prop({ enum: Access, required: true, type: String })
  access!: Access

  @Field()
  @prop({ required: true })
  token!: string
}

@ObjectType()
class Bookmarks {
  @Field()
  @prop({ required: true })
  articleId!: string

  @Field()
  @prop({ required: true, default: Date.now() })
  bookmarkedOn!: number
}

@ObjectType()
class History {
  @Field()
  @prop({ required: true })
  articleId!: string

  @Field()
  @prop({ required: true, default: Date.now() })
  visitedOn!: number
}

@ObjectType()
export class User {
  // @Field()
  // readonly _id!: ObjectId;

  @Field()
  @prop({
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      // eslint-disable-next-line quotes
      message: `{VALUE} is not a valid email`,
    },
  })
  email!: string;

  @Field({ nullable: false })
  @prop({
    required: true,
    // unique: true,
    trim: true,
    minlength: 1,
  })
  fullname?: string;

  @Field({ nullable: false })
  @prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 1,
  })
  username?: string;

  @Field({ nullable: false })
  @prop({
    required: true,
    default: `https://avatars.dicebear.com/v2/identicon/${uuid()}.svg`,
    trim: true,
    minlength: 1,
  })
  profileImage?: string;

  @Field()
  @prop({
    required: true,
    maxlength: 160,
    minlength: 0,
    default: '',
    trim: true,
  })
  userBio!: string;

  @Field()
  @prop({
    enum: AccountType,
    defualt: AccountType.NORMIE,
    type: Number,
    required: true,
  })
  accountType!: AccountType;

  @Field()
  @prop({
    enum: Gender,
    default: Gender.NOT_SPECIFIED,
    type: Number,
    required: true,
  })
  gender!: Gender;

  @Field()
  @prop({
    required: true,
    // eslint-disable-next-line quotes
    default: `user.${uuid()}`,
  })
  userId!: string;

  @Field()
  @prop({
    required: true,
    default: Date.now(),
  })
  accountCreatedOn!: number;

  @Field()
  @prop()
  accountInitialised!: number;

  @Field()
  @prop({
    required: true,
    enum: EmailVerified,
    default: EmailVerified.NO,
    type: Number,
  })
  emailVerified!: EmailVerified

  @Field()
  @prop({ required: true })
  password!: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(() => [Token])
  @prop({ type: () => Token, default: [] })
  tokens!: Token[]

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(() => [Bookmarks])
  @prop({ default: [] })
  bookmarks!: Bookmarks[]

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(() => [History])
  @prop({ type: () => History, default: [] })
  history!: History[]
}

export const UserModel = getModelForClass(User, { existingMongoose: mongoose });

export default UserModel;
