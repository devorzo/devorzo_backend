/* eslint-disable func-names */
import {
  prop, getModelForClass, DocumentType, pre, ReturnModelType,
} from '@typegoose/typegoose';
// import { ObjectId } from 'mongodb';
import { Field, ObjectType, Int } from 'type-graphql';
import validator from 'validator';
import { v4 as uuid } from 'uuid';
import mongoose from 'mongoose';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import logger, { Level } from '../../lib/logger';
import { generateHexString } from '../../lib/hex_rand';

mongoose.Promise = global.Promise;

export enum Gender {
  'MALE',
  'FEMALE',
  'OTHER',
  'NOT_SPECIFIED' = -1
}

export enum AccountType {
  'NORMIE',
  'MODERATOR',
  'ADMIN'
}

export enum Access {
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

// @ObjectType()
class Token {
  // @Field()
  @prop({ enum: Access, required: true, type: String })
  access!: Access

  // @Field()
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
class SocialLinks {
  @Field({ nullable: true })
  @prop()
  github!: string;

  @Field({ nullable: true })
  @prop()
  twitter!: string;

  @Field({ nullable: true })
  @prop()
  linkedin!: string;

  @Field({ nullable: true })
  @prop()
  link!: string;
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
@pre<User>('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (error, hash) => {
        if (err) {
          logger(error, Level.ERROR);
          next(err);
        }

        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
})
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
    // required: true,
    maxlength: 160,
    minlength: 0,
    default: '',
    trim: true,
  })
  userBio!: string;

  @Field(() => Int, { nullable: true })
  @prop({
    enum: AccountType,
    defualt: AccountType.NORMIE,
    type: Number,
    // required: true,
  })
  accountType!: AccountType;

  @Field(() => Int)
  @prop({
    enum: Gender,
    required: true,
    default: Gender.NOT_SPECIFIED,
    type: Number,
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

  @Field(() => Int, { nullable: true })
  @prop()
  accountInitialised!: number;

  @Field(() => Int, { nullable: true })
  @prop({
    required: true,
    enum: EmailVerified,
    default: EmailVerified.NO,
    type: Number,
  })
  emailVerified!: EmailVerified

  // @Field()
  @prop({ required: true })
  password!: string;

  @Field(() => SocialLinks, { nullable: true })
  @prop({ type: SocialLinks })
  socialLinks!: SocialLinks

  // @Field(() => [Token])
  @prop({ type: () => Token, default: [] })
  tokens!: Token[]

  @Field(() => [Bookmarks], { defaultValue: [] })
  @prop({ type: () => Bookmarks, default: [] })
  bookmarks!: Bookmarks[]

  @Field(() => [History], { defaultValue: [] })
  @prop({ type: () => History, default: [] })
  history!: History[]

  @Field({ nullable: true })
  authToken?: string;

  /* statics */

  public static async findByCredentials(
    this: ReturnModelType<typeof User>,
    email: string,
    password: string,
  ): Promise<User | null> {
    return this.findOne({
      email,
    }).then((user: DocumentType<User> | null) => {
      if (!user) {
        return Promise.resolve(null);
      }

      const compare = bcrypt.compareSync(password, user.password);
      if (compare) { return user; }
      return null;
    });
  }

  /* methods */

  public async toJSON(this: DocumentType<User>): Promise<Partial<User>> {
    return _.pick(this, [
      'userId',
      'email',
      'fullname',
      'username',
      'profileImage',
      'userBio',
      'accountType',
      'gender',
      'accountCreatedOn',
    ]);
  }

  public async setOauthToken(
    this: DocumentType<User>,
    access: Access.TWITTER_ID | Access.GITHUB_ID,
    token: string,
    isSigned = true,
  ): Promise<string> {
    let signedToken = token;
    if (isSigned) {
      signedToken = jwt.sign(
        {
          userId: this.userId,
          token,
          access,
        }, process.env.JWT_SECRET!,
      ).toString();
    }

    this.tokens.push({ access, token });
    await this.save();

    return signedToken;
  }

  public async generateToken(
    this: DocumentType<User>,
    access: Access,
    isSigned = true,
  ): Promise<string> {
    const token = generateHexString(128);
    let signedToken = token;
    if (isSigned) {
      signedToken = jwt.sign(
        {
          userId: this.userId,
          token,
          access,
        }, process.env.JWT_SECRET!,
        {
          expiresIn: '15m',
        },
      ).toString();
    }

    this.tokens.push({ access, token });
    await this.save();

    return signedToken;
  }

  public async removeToken(
    this: DocumentType<User>,
    token: string,
    access: Access,
  ): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = jwt.decode(token, {
      complete: true,
    });

    if (decoded) {
      if (decoded.access == access) {
        await this.updateOne({
          $pull: {
            tokens: { token: decoded.token, access },
          },
        });
        return true;
      }
    }
    return false;
  }

  public async removeAllTokens(
    this: DocumentType<User>,
    access: Access,
  ): Promise<Partial<User>> {
    return (await this.updateOne({
      $pull: {
        tokens: { access },
      },
    })).toJSON();
  }
}

export const UserModel = getModelForClass(User, { existingMongoose: mongoose });

export default UserModel;
