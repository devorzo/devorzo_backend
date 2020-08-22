import { prop, getModelForClass } from '@typegoose/typegoose';
// import { ObjectId } from 'mongodb';
import { Field, ObjectType } from 'type-graphql';
import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

@ObjectType()
export class Followers {
  @Field()
  @prop({
    required: true,
    trim: true,
  })
  followerId!:string;

  @Field()
  @prop({
    required: true,
    default: Date.now(),
  })
  followerOn!:number;
}
@ObjectType()
export class Follow {
  @Field()
  @prop({
    required: true,
    trim: true,
  })
  userId!: string;
}

export const FollowModel = getModelForClass(Follow, { existingMongoose: mongoose });

export default FollowModel;
