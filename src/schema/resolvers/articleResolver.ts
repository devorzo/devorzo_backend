import {
  Resolver, Mutation, Query, Arg, Ctx, FieldResolver, Root,
} from 'type-graphql';
import _ from 'lodash';
// import logger from '../../lib/logger';
import { Article, ArticleModel, ArticleType } from '../entities/article';
import {
  User, UserModel, History, Bookmarks,
} from '../entities/user';

import {
  ArticleInputType,
  ArticleInput,
  FindArticleInput,
} from '../inputs/articleInputs';
import { Context } from '../contexts/contextType';

@Resolver(() => History)
export class HistoryResolver {
  @FieldResolver(() => Article)
  async article(
    @Root() r: History,
    @Ctx() context: Context,
  ): Promise<Article | null> {
    if (!context.user) return null;
    const a = await ArticleModel.findOne({
      articleId: r.articleId,
    });

    return a;
  }

  @Mutation(() => Boolean, { nullable: true })
  async addToBookmarks(
    @Arg('where') articleData: FindArticleInput,
    @Ctx() context: Context,
  ): Promise<boolean | null> {
    if (!context.user) return null;
    const bookmarked = await UserModel.exists({
      userId: context.user.userId,
      'bookmarks.articleId': articleData.articleId,
    });

    if (!bookmarked) {
      const b = await UserModel.findOneAndUpdate({
        userId: context.user.userId,
      }, {
        $push: {
          bookmarks: {
            articleId: articleData.articleId,
            bookmarkedOn: Date.now(),
          },
        },
      });

      if (b) return true;
    }

    return null;
  }

  @Mutation(() => Boolean, { nullable: true })
  async removeArticleFromBookmarks(
    @Arg('where') articleData: FindArticleInput,
    @Ctx() context: Context,
  ): Promise<boolean | null> {
    if (!context.user) return null;
    const bookmarked = await UserModel.exists({
      userId: context.user.userId,
      'bookmarks.articleId': articleData.articleId,
    });

    if (bookmarked) {
      const b = await UserModel.findOneAndUpdate({
        userId: context.user.userId,
      }, {
        $pull: {
          bookmarks: {
            articleId: articleData.articleId,
          },
        },
      });

      if (b) return true;
    }

    return null;
  }

  @Mutation(() => Boolean, { nullable: true })
  async clearAllBookmarks(
    @Ctx() context: Context,
  ): Promise<boolean | null> {
    if (!context.user) return null;
    const u = await UserModel.findByIdAndUpdate({
      userId: context.user.userId,
    }, {
      bookmarks: [],
    });

    if (u) return true;
    return null;
  }
}

@Resolver(() => Bookmarks)
export class BookmarkResolver {
  @FieldResolver(() => Article)
  async article(
    @Root() r: History,
    @Ctx() context: Context,
  ): Promise<Article | null> {
    if (!context.user) return null;
    const a = await ArticleModel.findOne({
      articleId: r.articleId,
    });

    return a;
  }

  @Mutation(() => Boolean, { nullable: true })
  async addToHistory(
    @Arg('where') articleData: FindArticleInput,
    @Ctx() context: Context,
  ): Promise<boolean | null> {
    if (!context.user) return null;
    const history = await UserModel.exists({
      userId: context.user.userId,
      'history.articleId': articleData.articleId,
    });

    if (!history) {
      const h = await UserModel.findOneAndUpdate({
        userId: context.user.userId,
      }, {
        $push: {
          history: {
            articleId: articleData.articleId,
            visitedOn: Date.now(),
          },
        },
      });

      if (h) return true;
    }

    return null;
  }

  @Mutation(() => Boolean, { nullable: true })
  async removeArticleFromHistory(
    @Arg('where') articleData: FindArticleInput,
    @Ctx() context: Context,
  ): Promise<boolean | null> {
    if (!context.user) return null;
    const history = await UserModel.exists({
      userId: context.user.userId,
      'history.articleId': articleData.articleId,
    });

    if (history) {
      const h = await UserModel.findOneAndUpdate({
        userId: context.user.userId,
      }, {
        $pull: {
          history: {
            articleId: articleData.articleId,
          },
        },
      });

      if (h) return true;
    }

    return null;
  }

  @Mutation(() => Boolean, { nullable: true })
  async clearAllHistory(
    @Ctx() context: Context,
  ): Promise<boolean | null> {
    if (!context.user) return null;
    const u = await UserModel.findByIdAndUpdate({
      userId: context.user.userId,
    }, {
      history: [],
    });

    if (u) return true;
    return null;
  }
}

@Resolver(() => Article)
export class ArticleResolver {
  /*
  article
  articles
   - featured
   - latest
   - popular
   - user
   - history
   - bookmark

  createNewArticle
  deleteArticle
  updateArticle

  like
  view
  comment
  */

  @FieldResolver(() => User, { nullable: true })
  async author(@Root() r: Article): Promise<Partial<User> | null> {
    const u = (await UserModel.findOne({
      userId: r.authorId,
    }))?.toJSON();

    return u;
  }

  @FieldResolver(() => Boolean, { nullable: true })
  async isArticleLiked(@Root() r: Article, @Ctx() context: Context): Promise<boolean | null> {
    if (context.user == null) { return null; }

    let isLiked = false;
    r.likes.forEach((i) => {
      if (i.userId == context.user?.userId) {
        isLiked = true;
      }
    });

    return isLiked;
  }

  @Query(() => Article, { nullable: true })
  async article(
    @Arg('where') articleData: FindArticleInput,
  ): Promise<Article | null> {
    const a = await ArticleModel.findOne({
      articleId: articleData.articleId,
    });

    return a;
  }

  @Query(() => [Article], { nullable: true })
  async articles(
    @Arg('where', { nullable: true }) articleData: ArticleInput,
    @Arg('skip', { nullable: true }) skip: number,
    @Arg('limit', { nullable: true }) limit: number,
  ): Promise<Article[] | null> {
    let s = skip;
    let l = limit;

    if (!skip) s = 0;
    if (!limit) l = 0;

    // if (
    //   !articleData
    //   || !articleData?.articleType
    //   || articleData?.articleType == ArticleInputType.FEATURED
    //   || articleData?.articleType == ArticleInputType.LATEST
    //   || articleData?.articleType == ArticleInputType.POPULAR
    // ) {
    const u = await ArticleModel.find({
      ..._.pickBy({
        authorId: (articleData?.authorId) ? articleData.authorId : null,
        articleType: (articleData?.articleType == ArticleInputType.FEATURED)
          ? ArticleType.FEATURED : null,
      },
      v => (v != null && v != undefined)),
    }).sort({
      ..._.pickBy({
        _id: (articleData?.articleType == ArticleInputType.LATEST
          || articleData?.articleType == ArticleInputType.FEATURED) ? -1 : null,
        views: (articleData?.articleType == ArticleInputType.POPULAR) ? -1 : null,
      },
      v => (v != null && v != undefined)),
    }).skip(s).limit(l);

    return u;
    // }

    return null;
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
