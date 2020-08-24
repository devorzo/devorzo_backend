import { InputType, Field } from 'type-graphql';
import { Article, Comments } from '../entities/article';

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
export class NewArticleInput implements Partial<Article & { tagStrings: string[] }> {
  @Field()
  title!: string;

  @Field({ nullable: true })
  articleBanner!: string;

  @Field()
  content!: string;

  @Field()
  preview!: string;

  @Field(() => [String], { nullable: true })
  tagsStrings!: string[]

  @Field({ nullable: true })
  belongsToCommunity!: number

  @Field({ nullable: true })
  communityId!: string;
}

@InputType()
export class CommentDataInputType implements Partial<Comments> {
  @Field()
  comment!: string;
}

@InputType()
export class FindCommentInputType implements Partial<Comments> {
  @Field()
  articleId!: string;

  @Field()
  commentId!: string;
}

@InputType()
export class FindArticleInput implements Partial<Article> {
  @Field()
  articleId!: string;
}
