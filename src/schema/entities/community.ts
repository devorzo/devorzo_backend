import { prop, getModelForClass } from '@typegoose/typegoose';
// import { ObjectId } from 'mongodb';
import { Field, ObjectType } from 'type-graphql';
import mongoose from 'mongoose';
import { v4 } from 'uuid';

mongoose.Promise = global.Promise;

export enum CommunityType {
  PUBLIC,
  PRIVATE,
  BROADCAST
}

@ObjectType()
export class Community {
  @Field()
  @prop({
    trim: true,
  })
  rules!: string;

  @Field()
  @prop({
    default: `community.${v4()}`,
    required: true,
    trim: true,
  })
  communityId!: string;

  @Field()
  @prop({
    required: true,
    default: '',
    trim: true,
  })
  communityBanner!: string;

  @Field()
  @prop({
    default: '',
    required: true,
    trim: true,
  })
  communityDp!: string;

  @Field()
  @prop({
    type: Number,
    enum: CommunityType,
    default: CommunityType.PUBLIC,
    required: true,
  })
  communityType!: CommunityType;

  @Field()
  @prop({
    trim: true,
    required: true,
  })
  name!: string;

  @Field()
  @prop({
    trim: true,
    required: true,
  })
  about!: string;

  @Field()
  @prop({
    required: true,
    default: Date.now(),
  })
  createdOn!: number;
}

export const CommunityModel = getModelForClass(Community, { existingMongoose: mongoose });

export default CommunityModel;
