import { prop, getModelForClass } from '@typegoose/typegoose';
// import { ObjectId } from 'mongodb';
import {
  Field, ObjectType,
} from 'type-graphql';
import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

@ObjectType()
export class Followers {
  @Field()
  @prop({
    required: true,
    trim: true,
    unique: true,
  })
  followerId!: string;

  @Field()
  @prop({
    required: true,
    default: Date.now(),
  })
  followedOn!: number;
}

@ObjectType()
export class Follow {
  @Field()
  @prop({
    required: true,
    trim: true,
    unique: true,
  })
  userId!: string;

  @Field(() => [Followers], { defaultValue: [] })
  @prop({ type: () => Followers, default: [] })
  followers!: Followers[]
}

export const FollowModel = getModelForClass(Follow, { existingMongoose: mongoose });

export default FollowModel;
