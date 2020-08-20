import {
  Resolver, Mutation, Query,
} from 'type-graphql';
// import logger from '../../lib/logger';
import { Article, ArticleModel } from '../entities/article';

@Resolver(() => Article)
export class ArticleResolver {
  @Query()
  helloFromArticle(): string {
    return 'Hello world';
  }

  @Query(() => [Article])
  async articles(): Promise<Article[]> {
    const u = await ArticleModel.find();
    return u;
  }

  @Mutation(() => Article)
  async addTestArticle(): Promise<Article> {
    const a = new ArticleModel({
      title: 'Test article',
      content: 'Test content',
      preview: 'Test preview',
      authorId: 'testuser123',
    });
    const saved = await a.save();
    return saved;
  }
}

export default ArticleResolver;
