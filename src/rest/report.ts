import { Aphorism, IAphorismDocument } from "../models/aphorism-model";
import { Article, IArticleDocument } from "../models/article-model";
import { Gallery, IGalleryDocument } from "../models/gallery-model";
import {Poem, IPoemDocument} from "../models/poem-model";
import Telegram from "../telegram/telegram";

class Report {
  static async report() {
    const maxVisitedArticle = await Article.maxVisited();
    const articleVisitCount = await Article.visitCount();
    const articleNotSharedCount = (await Article.find({isFacebookShared: false})).length;
    const maxVisitedPoem = await Poem.maxVisited();
    const poemVisitCount = await Poem.visitCount();
    const poemNotSharedCount = (await Poem.find({isFacebookShared: false})).length;
    const maxVisitedAphorism = await Aphorism.maxVisited();
    const aphorismVisitCount = await Aphorism.visitCount();
    const aphorismNotSharedCount = (await Aphorism.find({isFacebookShared: false})).length;
    const maxVisitedGallery = await Gallery.maxVisited();
    const galleryVisitCount = await Gallery.visitCount();
    const galleryNotSharedCount = (await Gallery.find({isFacebookShared: false})).length;
      Telegram.notify("info", "Report", 'Report', {
          articleVisitCount: articleVisitCount && articleVisitCount[0]?articleVisitCount[0].total: 0,
          maxVisitedArticle: maxVisitedArticle? `${maxVisitedArticle.title['hy']} ${maxVisitedArticle.visitCount}`: '' ,
          articleNotSharedCount,
          poemVisitCount: poemVisitCount && poemVisitCount[0]?poemVisitCount[0].total:0,
          maxVisitedPoem: maxVisitedPoem?`${maxVisitedPoem.title['hy']} ${maxVisitedPoem.visitCount}`: '' ,
          poemNotSharedCount ,
          aphorismVisitCount: aphorismVisitCount && aphorismVisitCount[0]?aphorismVisitCount[0].total :0,
          maxVisitedAphorism: maxVisitedAphorism? `${maxVisitedAphorism.text['hy']} ${maxVisitedAphorism.visitCount}` : '',
          aphorismNotSharedCount,
          galleryVisitCount: galleryVisitCount && galleryVisitCount[0]? galleryVisitCount[0].total : 0,
          maxVisiteGallery: maxVisitedGallery?(maxVisitedGallery && maxVisitedGallery.title && maxVisitedGallery.title['hy']) ? maxVisitedGallery.title['hy'] : maxVisitedGallery.galleryId : '',
          galleryNotSharedCount,
        });
    setTimeout(() => {
      Report.report();
    }, 2 * 60 * 60 * 1000);
  }
}
export default Report;