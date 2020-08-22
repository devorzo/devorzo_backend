import {
  Resolver, Mutation, Query,
} from 'type-graphql';
// import logger from '../../lib/logger';
import { Community, CommunityModel } from '../entities/community';

@Resolver(() => Community)
export class CommunityResolver {
  @Query()
  helloFromCommunity(): string {
    return 'Hello world';
  }

  @Query(() => [Community])
  async communities(): Promise<Community[]> {
    const u = await CommunityModel.find();
    return u;
  }

  @Mutation(() => Community)
  async addTestCommunity(): Promise<Community> {
    const u = new CommunityModel({
      name: 'Test community',
      about: 'Test about community',
      communityBanner: 'Test Banner',
      communityDp: 'Test DP',
    });
    const saved = await u.save();

    return saved;
  }
}

export default CommunityResolver;
