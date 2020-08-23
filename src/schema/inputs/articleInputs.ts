import { InputType, Field } from 'type-graphql';
import { Article } from '../entities/article';

export enum ArticleInputType {
  'FEATURED' = 'featured',
  'LATEST' = 'latest',
  'POPULAR' = 'popular',
}

@InputType()
export class ArticleInput {
  @Field({ nullable: true })
  authorId!: string;

  @Field({ nullable: true })
  articleType!: ArticleInputType
}

@InputType()
export class FindArticleInput implements Partial<Article> {
  @Field()
  articleId!: string;
}
