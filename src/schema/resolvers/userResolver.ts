import {
  Resolver, Mutation, Query, Ctx, Arg,
} from 'type-graphql';
// import logger from '../../lib/logger';
import _ from 'lodash';
import { v4 } from 'uuid';
import {
  User, UserModel, Access, AccountType,
} from '../entities/user';
import {
  CreateNewUserInput,
  CheckUserIfUniqueInput,
  FindUserInput,
  LogUserInput,
  UpdateUserInput,
} from '../inputs/userInputs';

import { Context } from '../contexts/contextType';
import FollowModel from '../entities/follower';
@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    let u = await UserModel.find();
    u = u.map((i) => i.toJSON());
    return u;
  }

  @Query(() => User, { nullable: true })
  async user(@Arg('where') userData: FindUserInput): Promise<Partial<User> | null> {
    const validUserData = _.pickBy(userData, v => (v != null && v != undefined));
    if (validUserData === {} || !(validUserData) || _.isEmpty(validUserData)) {
      return null;
    }
    let u = await UserModel.findOne({
      ...validUserData,
    });
    u = u?.toJSON();
    return u;
  }

  @Query(() => Boolean)
  async isUserUnique(@Arg('where') userData: CheckUserIfUniqueInput): Promise<boolean> {
    const u1 = (userData.email) ? (await UserModel.exists({ email: userData.email })) : false;
    const u2 = (userData.username) ? (
      await UserModel.exists({ username: userData.username })
    ) : false;
    return !(u1 || u2);
  }

  @Mutation(() => User, { nullable: true })
  async createNewUser(@Arg('data') newUserData: CreateNewUserInput): Promise<Partial<User | null>> {
    const size = await UserModel.find({}).limit(1).countDocuments();

    const savedUser = await new UserModel({
      ..._.pickBy(newUserData, v => (v != null && v != undefined)),
      userId: `user.${v4()}`,
      accountType: (size == 0) ? AccountType.ADMIN : AccountType.NORMIE,
    }).save();

    await new FollowModel({
      userId: savedUser.userId,
    }).save();

    const token = await savedUser.generateToken(Access.AUTH);

    return {
      ..._.pickBy(savedUser, v => (v != null && v != undefined)),
      authToken: token,
    };
  }

  @Mutation(() => User, { nullable: true })
  async loginExistingUser(@Arg('where') userData: LogUserInput): Promise<Partial<User | null>> {
    const user = await UserModel.findByCredentials(userData.email, userData.password);
    if (user) {
      const u = await UserModel.findOne({
        email: userData.email,
      });
      const token = await u?.generateToken(Access.AUTH);
      return {
        ...user,
        authToken: token,
      };
    }

    return null;
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg('where') userData: FindUserInput,
    @Arg('data') updatedData: UpdateUserInput,
    @Ctx() context: Context,
  ): Promise<User | null> {
    console.log({ context });
    if (context.user != null) {
      if (userData?.userId == context.user?.userId) {
        const u = await UserModel.findOneAndUpdate({
          userId: context.user?.userId,
        }, {
          ..._.pickBy(updatedData, v => (v != null && v != undefined)),
        });
        return u;
      }

      const u = await UserModel.findOne({
        'tokens.token': context.user?.userId,
        access: Access.AUTH,
      });

      if (u?.accountType == AccountType.ADMIN) {
        const updatedUser = await UserModel.findOneAndUpdate({
          userId: userData.userId,
        }, {
          ..._.pickBy(updatedData, v => (v != null && v != undefined)),
        });
        return updatedUser;
      }
    }

    return null;
  }

  @Mutation(() => Boolean, { nullable: true })
  async deleteUser(
    @Arg('where') userData: FindUserInput,
    @Ctx() context: Context,
  ): Promise<boolean | null> {
    if (context.user != null) {
      if (context.user.userId == userData.userId) {
        const d = await UserModel.findOneAndDelete({
          userId: userData.userId,
        });

        if (d) { return true; }
        return null;
      }
    }
    return null;
  }
}

export default UserResolver;
