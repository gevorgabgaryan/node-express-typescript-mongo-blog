
import {NumerusError} from '../shared/errors';
import {model, Schema, Model, Document} from 'mongoose';



export interface IArticleDocument extends Document {
    title: Object,
    desc: Object,
    text: Object,
    keywords: Object,
    alias: Object,
    visitCount: Number,
    likeCount: Number,
    commentCount: Number,
    originalImgName: String,
    imgExtension: String,
    imgObj: Object,
    articleId: String,
    visible: Boolean,
    category: Object,
    author: Object,
    imageData: String,
    createdAt: Date,
    isFacebookShared: Boolean,
    isFacebookSecondShared:  Boolean,
    facebookPostIds: any[],
    instagramPostIds: any[],
    isInstagramShared: Boolean ,
    isInstagramSecondShared:  Boolean

}

export interface IArticleModel extends Model<IArticleDocument> {
    getByArticleId: (articleId: string) => Promise<IArticleDocument>;
    maxVisited: () => Promise<IArticleDocument>;
    visitCount: () => Promise<any>;
    fbNotSharedArticle: () => Promise<any>;
    fbNotSecondSharedArticle: () => Promise<any>;
    instaNotSharedArticle: () => Promise<any>;
    instaNotSecondSharedArticle: () => Promise<any>;
}


const ArticlesSchema = new Schema(
  {
     title: Object,
    desc: Object,
    text: Object,
    keywords: Object,
    alias: Object,
    visitCount: {type: Number, default: 0},
    likeCount: {type: Number, default: 0},
    commentCount: {type: Number, default: 0},
    originalImgName: String,
    imgExtension: String,
    imgObj: Object,
    articleId: String,
    visible: { type: Boolean, default: false },
    category: Object,
    author: Object,
    isFacebookShared: {type: Boolean, default: false},
    imageData: String,
    facebookPostIds: {type: Array, default: []},
    isFacebookSecondShared: {type: Boolean, default: false},
    isInstagramShared: {type: Boolean, default: false},
    instagramPostIds: {type: Array, default: []},
    isInstagramSecondShared: {type: Boolean, default: false},
  },
  {
    collection: 'articles',
    timestamps: true,
  },

);



ArticlesSchema.statics.getByArticleId = async function (articleId: string) {
  const query = {
    articleId
  };

  try {
    return await this.findOne(query).select('-password').exec();
  } catch (err) {
    throw new NumerusError("Failed to connect to db", "ERROR_DB");
  }
}

ArticlesSchema.statics.maxVisited = async function () {

  try {
    return await this.findOne().sort({visitCount: -1}).exec();
  } catch (err) {
    throw new NumerusError("Failed to connect to db", "ERROR_DB");
  }
}
ArticlesSchema.statics.fbNotSharedArticle = async function () {
  try {
    return await this.findOne({isFacebookShared: false});
  } catch (err) {
    throw new NumerusError("Failed to connect to db", "ERROR_DB");
  }
}
ArticlesSchema.statics.fbNotSecondSharedArticle = async function () {
  try {
    return await this.findOne({isFacebookSecondShared: false});
  } catch (err) {
    throw new NumerusError("Failed to connect to db", "ERROR_DB");
  }
}

ArticlesSchema.statics.instaNotSharedArticle = async function () {
  try {
    return await this.findOne({isInstagramShared: false});
  } catch (err) {
    throw new NumerusError("Failed to connect to db", "ERROR_DB");
  }
}
ArticlesSchema.statics.instaNotSecondSharedArticle = async function () {
  try {
    return await this.findOne({isInstagramSecondShared: false});
  } catch (err) {
    throw new NumerusError("Failed to connect to db", "ERROR_DB");
  }
}

ArticlesSchema.statics.visitCount= async function () {
 return this.aggregate([ {
    $group: {
        _id: null,
        total: {
            $sum: "$visitCount"
        }
    }
  } ] )
}

export const Article = model<IArticleDocument, IArticleModel>('Article', ArticlesSchema);