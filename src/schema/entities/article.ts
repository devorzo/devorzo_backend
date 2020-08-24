import { prop, getModelForClass } from '@typegoose/typegoose';
// import { ObjectId } from 'mongodb';
import { Field, ObjectType } from 'type-graphql';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

mongoose.Promise = global.Promise;

export enum BooleanFlag {
  NO,
  YES,
  NOT_DECIDED = -1
}

export enum ArticleType {
  NORMAL,
  FEATURED
}

export const randNum = (min: number, max: number): number => {
  const random = Math.round(Math.random() * (+max - +min) + +min);
  return random;
};

@ObjectType()
export class Likes {
  @Field()
  @prop({
    trim: true,
    required: true,
  })
  userId!: string;

  @Field()
  @prop({
    default: Date.now(),
    required: true,
  })
  likedOn!: number;
}

@ObjectType()
export class Comments {
  @Field()
  @prop({
    default: `cmt.${uuid()}`,
    required: true,
    trim: true,
  })
  commentId!: string;

  @Field()
  @prop({
    required: true,
    trim: true,
  })
  userId!: string;

  @Field()
  @prop({
    required: true,
    trim: true,
  })
  comment!: string;

  @Field()
  @prop({
    default: Date.now(),
    required: true,
  })
  commentedOn!: number;
}

@ObjectType()
export class Tags {
  @Field()
  @prop({
    required: true,
    trim: true,
  })
  tag!: string;

  @Field()
  @prop({
    required: true,
    default: Date.now(),
  })
  addedOn!: number;
}

@ObjectType()
export class Article {
  @Field()
  @prop({
    required: true,
    minlength: 1,
    trim: true,
  })
  title!: string;

  @Field()
  @prop({
    required: true,
    minlength: 1,
    trim: true,
  })
  content!: string;

  @Field()
  @prop({
    required: true,
    minlength: 1,
    trim: true,
  })
  preview!: string;

  @Field()
  @prop({
    default: BooleanFlag.NO,
  })
  edited!: number;

  @Field({ nullable: true })
  @prop({
    default: BooleanFlag.NO,
  })
  lastEditedOn !: number;

  @Field()
  @prop({
    required: true,
    default: Date.now(),
  })
  createdOn!: number;

  @Field()
  @prop({
    required: true,
    default: `article.${uuid()}`,
    unique: true,
    minlength: 1,
    trim: true,
  })
  articleId!: string;

  @Field()
  @prop({
    required: true,
    trim: true,
  })
  authorId!: string;

  @Field({ nullable: true })
  @prop({
    // default: '',
    trim: true,
  })
  articleBanner!: string;

  @Field()
  @prop({
    default: 0,
    required: true,
  })
  views!: number;

  @Field({ nullable: true })
  @prop({
    enum: ArticleType,
    // default: ArticleType.NORMAL,
    type: Number,
  })
  articleType!: ArticleType;

  @Field({ nullable: true })
  @prop({
    // default: '',
    trim: true,
  })
  communityId!: string;

  @Field({ nullable: true })
  @prop({
    // default: BooleanFlag.NO,
  })
  belongsToCommunity!: number;

  @Field({ nullable: true })
  @prop({
    // default: BooleanFlag.NO,
  })
  moderationStatus!: number;

  /* Auto calc duration of article on client side */
  // @Field()
  // @prop({
  //   default: 0,
  // })
  // durationOfArticle!: number;

  @Field(() => [Likes])
  @prop({ type: () => Likes, default: [] })
  likes!: Likes[]

  @Field(() => [Comments])
  @prop({ type: () => Comments, default: [] })
  comments!: Comments[]

  @Field(() => [Tags])
  @prop({ type: () => Tags, default: [] })
  tags!: Tags[]
}

export const ArticleModel = getModelForClass(Article, { existingMongoose: mongoose });

export default ArticleModel;
