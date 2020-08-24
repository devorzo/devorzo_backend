import {
  Resolver, Mutation, Query, Arg, Ctx, FieldResolver, Root,
} from 'type-graphql';
import _ from 'lodash';

import { v4 } from 'uuid';
import {
  Article, ArticleModel, ArticleType, Comments, Tags,
} from '../entities/article';
import {
  User, UserModel, History, Bookmarks,
} from '../entities/user';

import {
  ArticleInputType,
  ArticleInput,
  FindArticleInput,
  NewArticleInput,
  CommentDataInputType,
  FindCommentInputType,
} from '../inputs/articleInputs';
import { Context } from '../contexts/contextType';

@Resolver(() => Comments)
export class CommentResolver {
  @FieldResolver(() => User, { nullable: true })
  async user(@Root() r: Comments): Promise<Partial<User> | null> {
    const u = (await UserModel.findOne({
      userId: r.userId,
    }))?.toJSON();

    return u;
  }

  @Mutation(() => Boolean, { nullable: true })
  async addComment(
    @Arg('where') articleData: FindArticleInput,
    @Arg('data') commentData: CommentDataInputType,
    @Ctx() context: Context,
  ): Promise<boolean | null> {
    if (context.user == null) { return null; }

    const c = await ArticleModel.findOneAndUpdate({
      articleId: articleData.articleId,
    }, {
      $push: {
        comments: {
          userId: context.user.userId,
          comment: commentData.comment,
          commentId: `cmt.${v4()}`,
          commentedOn: Date.now(),
        },
      },
    });

    if (c) return true;

    return null;
  }

  @Mutation(() => Boolean, { nullable: true })
  async removeComment(
    @Arg('where') articleData: FindCommentInputType,
    @Ctx() context: Context,
  ): Promise<boolean | null> {
    if (context.user == null) { return null; }

    const c = await ArticleModel.findOneAndUpdate({
      articleId: articleData.articleId,
      'comments.commentId': articleData.commentId,
      'comments.userId': context.user.userId,
    }, {
      $pull: {
        comments: {
          commentId: articleData.commentId,
        },
      },
    });

    if (c) return true;

    return null;
  }

  @Mutation(() => Boolean, { nullable: true })
  async editComment(
    @Arg('where') articleData: FindCommentInputType,
    @Arg('data') commentData: CommentDataInputType,
    @Ctx() context: Context,
  ): Promise<boolean | null> {
    if (context.user == null) { return null; }

    const c = await ArticleModel.findOneAndUpdate({
      articleId: articleData.articleId,
      'comments.commentId': articleData.commentId,
      'comments.userId': context.user.userId,
    }, {
      $set: {
        'comments.$.comment': commentData.comment,
      },
    });

    if (c) return true;

    return null;
  }
}

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

  @FieldResolver(() => Boolean, { nullable: true })
  async isArticleBookmarked(@Root() r: Article, @Ctx() context: Context): Promise<boolean | null> {
    if (context.user == null) { return null; }

    let isBookmarked = false;
    context?.user?.bookmarks.forEach((b) => {
      if (b.articleId == r.articleId) {
        isBookmarked = true;
      }
    });

    return isBookmarked;
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
  }

  @Mutation(() => Article)
  async createNewArticle(
    @Arg('data') articleData: NewArticleInput,
    @Ctx() context: Context,
  ): Promise<Article | null> {
    if (context.user == null) { return null; }

    // eslint-disable-next-line prefer-const
    let t: Tags[] = [];

    if (articleData.tagsStrings?.length > 0) {
      articleData.tagsStrings?.forEach((tag) => {
        t.push({
          tag,
          addedOn: Date.now(),
        });
      });
    }

    const a = await new ArticleModel({
      ..._.pickBy({
        title: articleData.title,
        context: articleData.content,
        preview: articleData.preview,
        articleBanner: articleData.articleBanner,
        belongsToCommunity: articleData.belongsToCommunity,
        communityId: articleData.communityId,
        authorId: context.user.userId,
        tags: t,
      },
      v => (v != null && v != undefined)),
    }).save();

    return a;
  }

  @Mutation(() => Article)
  async updateArticle(
    @Arg('where') articleData: FindArticleInput,
    @Arg('data') updatedArticleData: NewArticleInput,
    @Ctx() context: Context,
  ): Promise<Article | null> {
    if (context.user == null) { return null; }

    // eslint-disable-next-line prefer-const
    let t: Tags[] = [];

    if (updatedArticleData.tagsStrings?.length > 0) {
      updatedArticleData.tagsStrings?.forEach((tag) => {
        t.push({
          tag,
          addedOn: Date.now(),
        });
      });
    }

    const a = await ArticleModel.findOneAndUpdate({
      articleId: articleData.articleId,
      authorId: context.user.userId,
    }, {
      title: updatedArticleData.title,
      context: updatedArticleData.content,
      preview: updatedArticleData.preview,
      articleBanner: updatedArticleData.articleBanner,
      belongsToCommunity: updatedArticleData.belongsToCommunity,
      communityId: updatedArticleData.communityId,
      authorId: context.user.userId,
      tags: t,
    });

    if (a) { return a; }

    return null;
  }

  @Mutation(() => Article)
  async deleteArticle(
    @Arg('where') articleData: FindArticleInput,
    @Ctx() context: Context,
  ): Promise<boolean | null> {
    if (context.user == null) { return null; }

    const a = await ArticleModel.findOneAndDelete({
      articleId: articleData.articleId,
      authorId: context.user.userId,
    });

    if (a) return true;

    return null;
  }

  @Mutation(() => Boolean, { nullable: true })
  async likeArticle(
    @Arg('where') articleData: FindArticleInput,
    @Ctx() context: Context,
  ): Promise<boolean | null> {
    if (context.user == null) { return null; }

    const liked = await ArticleModel.exists({
      articleId: articleData.articleId,
      'likes.userId': context.user.userId,
    });

    if (!liked) {
      const l = await ArticleModel.findOneAndUpdate({
        articleId: articleData.articleId,
      }, {
        $push: {
          likes: {
            userId: context.user.userId,
            likedOn: Date.now(),
          },
        },
      });

      if (l) return true;
    }

    return null;
  }

  @Mutation(() => Boolean, { nullable: true })
  async unlikeArticle(
    @Arg('where') articleData: FindArticleInput,
    @Ctx() context: Context,
  ): Promise<boolean | null> {
    if (context.user == null) { return null; }

    const liked = await ArticleModel.exists({
      articleId: articleData.articleId,
      'likes.userId': context.user.userId,
    });

    if (liked) {
      const l = await ArticleModel.findOneAndUpdate({
        articleId: articleData.articleId,
      }, {
        $pull: {
          likes: {
            userId: context.user.userId,
          },
        },
      });

      if (l) return true;
    }

    return null;
  }

  @Mutation(() => Boolean, { nullable: true })
  async addViews(
    @Arg('where') articleData: FindArticleInput,
    @Ctx() context: Context,
  ):Promise<boolean | null> {
    if (context.user == null) return null;
    const u = await ArticleModel.findOneAndUpdate({
      articleId: articleData.articleId,
    }, {
      $inc: {
        views: 1,
      },
    });

    if (u) return true;

    return null;
  }
}
