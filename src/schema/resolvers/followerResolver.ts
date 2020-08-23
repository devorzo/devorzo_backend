import {
  Resolver, Mutation, Query, Ctx, Arg, Root, FieldResolver,
} from 'type-graphql';
// import logger from '../../lib/logger';
import _ from 'lodash';
import {
  User, UserModel,
} from '../entities/user';
import {
  FollowUserInput,
} from '../inputs/userInputs';

import { Context } from '../contexts/contextType';
import FollowModel, { Follow, Followers } from '../entities/follower';

@Resolver(() => Followers)
export class FollowerResolver {
  @FieldResolver(() => User, { nullable: true })
  async follower(@Root() r: Followers): Promise<Partial<User> | null> {
    const u = (await UserModel.findOne({
      userId: r.followerId,
    }))?.toJSON();

    return u;
  }
}

@Resolver(() => Follow)
export class FollowResolver {
  @FieldResolver(() => User, { nullable: true })
  async user(@Root() r: Follow): Promise<Partial<User> | null> {
    const u = (await UserModel.findOne({
      userId: r.userId,
    }))?.toJSON();

    return u;
  }

  @Query(() => Follow, { nullable: true })
  async followers(@Arg('where') userData: FollowUserInput): Promise<Follow | null> {
    const followers = await FollowModel.findOne({
      userId: userData.userId,
    });

    return followers;
  }

  @Query(() => [Follow])
  async following(@Arg('where') userData: FollowUserInput): Promise<Follow[] | null> {
    const followers = await FollowModel.find({
      'followers.followerId': userData.userId,
    });
    return followers;
  }

  @Mutation(() => Boolean, { nullable: true })
  async followUser(
    @Arg('where') userData: FollowUserInput,
    @Ctx() context: Context,
  ): Promise<boolean | null> {
    const validUserData = _.pickBy(userData, v => (v != null && v != undefined));
    if (validUserData === {} || !(validUserData) || _.isEmpty(validUserData)) {
      return null;
    }

    if (context.user != null) {
      if (context.user.userId == validUserData.userId) { return null; }

      const userExists = await UserModel.exists({
        ...validUserData,
      });

      if (userExists) {
        const doesUserFollow = await FollowModel.exists({
          userId: validUserData.userId,
          'followers.followerId': context.user.userId,
        });

        if (doesUserFollow) { return null; }

        const followed = await FollowModel.findOneAndUpdate({
          userId: validUserData.userId,
        }, {
          $push: {
            followers: {
              followerId: context.user.userId,
              followedOn: Date.now(),
            },
          },
        });

        if (followed) { return true; }
      }
    }

    return null;
  }

  @Mutation(() => Boolean, { nullable: true })
  async unfollowUser(
    @Arg('where') userData: FollowUserInput,
    @Ctx() context: Context,
  ): Promise<boolean | null> {
    const validUserData = _.pickBy(userData, v => (v != null && v != undefined));
    if (validUserData === {} || !(validUserData) || _.isEmpty(validUserData)) {
      return null;
    }

    if (context.user != null) {
      if (context.user.userId == validUserData.userId) { return null; }

      const userExists = await UserModel.exists({
        ...validUserData,
      });

      if (userExists) {
        const unfollowed = await FollowModel.findOneAndUpdate({
          userId: validUserData.userId,
        }, {
          $pull: {
            followers: {
              followerId: context.user.userId,
            },
          },
        });

        if (unfollowed) { return true; }
      }
    }

    return null;
  }
}

export default FollowResolver;
