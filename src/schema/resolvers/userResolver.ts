import {
  Resolver, Mutation, Query,
} from 'type-graphql';
// import { DocumentType } from '@typegoose/typegoose';
// import { DocumentQuery } from 'mongoose';
// import logger from '../../lib/logger';
import { User, UserModel } from '../entities/user';

@Resolver(() => User)
export class UserResolver {
  @Query()
  helloFromUser(): string {
    return 'Hello world';
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    const u = await UserModel.find();
    return u;
  }

  @Mutation(() => User)
  async addTestUser(): Promise<User> {
    const u = new UserModel({
      email: 'test@test.com',
      password: 'abc123',
      username: 'test_username',
      fullname: 'Test fullname',
      userBio: 'Test userbio',
      accountType: 0,
    });
    const saved = await u.save();

    return saved;
  }
}

export default UserResolver;
