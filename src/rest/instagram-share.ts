import {Aphorism, IAphorismDocument} from "../models/aphorism-model";
import {Article, IArticleDocument} from "../models/article-model";
import {Gallery, IGalleryDocument} from "../models/gallery-model";
import {Poem, IPoemDocument} from "../models/poem-model";
import Telegram from "../telegram/telegram";
import schedule from "node-schedule";
import logger from "../shared/logger";
import Instagram from "../instagram/";
import Env from "../../env";
import { NumerusError } from "../shared/errors";

class InstagramShare {
  static async shareGallery(h: number, m: number) {
    const rule = new schedule.RecurrenceRule();
    rule.tz = "Etc/UTC";
    rule.hour = h;
    rule.minute = m;
    rule.second = 0;
    schedule.scheduleJob(rule, async () => {
      try {
        let gallery = await Gallery.instaNotSharedGallery();
        if (!gallery) {
          gallery = await Gallery.instaNotSecondSharedGallery();
          if (!gallery) {
            await Gallery.updateMany({}, {isInstagramSecondShared: false});
            gallery = await Gallery.instaNotSecondSharedGallery();
          }
          gallery.isInstagramSecondShared = true;
        } else {
          gallery.isInstagramShared = true;
        }

        await gallery.save();
        const postId = await Instagram.postPhoto(
          `/images/gallerys/${gallery.galleryId}/original_product_${gallery.galleryId}.jpg`,
          `${Env.website}gallery/${gallery.galleryId}/hy`,
          true
        );


        if (postId) {
          Telegram.notify("info", "InstagramShare", "InstagramShare", {
            link: `${Env.website}gallery/${gallery.galleryId}/hy`,
          });
          gallery.isInstagramShared = true;
          gallery.instagramPostIds = [postId];
          await gallery.save();
        }
      } catch (e) {
        console.log(e);
        logger.error(e);
        await Instagram.login();
        throw new NumerusError((JSON.stringify(e)).slice(0, 20), "Instagrsm_FAILED");
      }
    });
  }

  static async sharePoem(h: number, m: number) {
    const rule = new schedule.RecurrenceRule();
    rule.tz = "Etc/UTC";
    rule.hour = h;
    rule.minute = m;
    rule.second = 0;
    schedule.scheduleJob(rule, async () => {
      try {
        let poem = await Poem.instaNotSharedPoem();
        if (!poem) {
          poem = await Poem.instaNotSecondSharedPoem();
          if (!poem) {
            await Poem.updateMany({}, {isInstagramSecondShared: false});
            poem = await Poem.instaNotSecondSharedPoem();
          }
          poem.isInstagramSecondShared = true;
        } else {
          poem.isInstagramShared = true;
        }
        await poem.save();
        const postId = await Instagram.postPhoto(
            `/images/poems/${poem.poemId}/middle.jpg`,
            `${poem.desc["hy"] ? poem.desc["hy"] : ""} ${
              Env.website
            }poems/${poem.poemId}/hy`,
            false
        );

        if (postId) {
          Telegram.notify("info", "InstagramShare", "InstagramShare", {
            link: `${Env.website}poems/${poem.poemId}/hy`,

          });
          poem.isInstagramShared = true;
          poem.instagramPostIds = [postId];
          await poem.save();
        }
      } catch (e) {
        console.log(e);
        logger.error(e);
        throw new NumerusError(JSON.stringify(e), "Instagrsm_FAILED");
      }
    });
  }

  static async shareAphorism(h: number, m: number) {
    const rule = new schedule.RecurrenceRule();
    rule.tz = "Etc/UTC";
    rule.hour = h;
    rule.minute = m;
    rule.second = 0;
    schedule.scheduleJob(rule, async () => {
      try {
        let aphorism = await Aphorism.instaNotSharedAphorism();
        if (!aphorism) {
          aphorism = await Aphorism.instaNotSecondSharedAphorism();
          if (!aphorism) {
            await Aphorism.updateMany({}, {isInstagramSecondShared: false});
            aphorism = await Aphorism.instaNotSecondSharedAphorism();
          }
          aphorism.isInstagramSecondShared = true;
        } else {
          aphorism.isInstagramShared = true;
        }
        aphorism.isInstagramShared = true;
           await aphorism.save();
        const postId = await Instagram.postPhoto(
            `/images/aphorism/${aphorism.aphorismId}/${aphorism.aphorismId}hy.jpg`,
            `${Env.website}aphorisms/${aphorism.aphorismId}/hy`,
          true
        );
        if (postId) {
          Telegram.notify("info", "InstagramShare", "InstagramShare", {
            link: `${Env.website}aphorisms/${aphorism.aphorismId}/hy`,

          });
          aphorism.isInstagramShared = true;
          aphorism.instagramPostIds = [postId];
          await aphorism.save();
        }
      } catch (e) {
        console.log(e);
        logger.error(e);
        throw new NumerusError(JSON.stringify(e), "Instagrsm_FAILED");
      }
    });
  }

  static async shareArticle(h: number, m: number) {
    const rule = new schedule.RecurrenceRule();
    rule.tz = "Etc/UTC";
    rule.hour = h;
    rule.minute = m;
    rule.second = 0;
    schedule.scheduleJob(rule, async () => {
      try {
        let article = await Article.instaNotSharedArticle();
        if (!article) {
          article = await Article.instaNotSecondSharedArticle();
          if (!article) {
            await Article.updateMany({}, {isInstagramSecondShared: false});
            article = await Article.instaNotSecondSharedArticle();
          }
          article.isInstagramSecondShared = true;
        } else {
          article.isInstagramShared = true;
        }
        await article.save();
        const postId = await Instagram.postPhoto(
          `/images/articles/${article.articleId}/middle.jpg`,
          `${article.desc["hy"] ? article.desc["hy"] : ""} ${
            Env.website
          }articles/${article.articleId}/hy`,
          false
        );

        if (postId) {
          Telegram.notify("info", "InstagramShare", "InstagramShareArticle", {
            link: `${Env.website}articles/${article.articleId}/hy`,

          });
          article.isInstagramShared = true;
          article.instagramPostIds = [postId];
          await article.save();
        }
      } catch (e) {
        console.log(e);
        logger.error(e);
        throw new NumerusError(JSON.stringify(e), "Instagrsm_FAILED");
      }
    });
  }

  static async login(h: number, m: number
    ) {
    const rule = new schedule.RecurrenceRule();
    rule.tz = "Etc/UTC";
    rule.hour = h;
    rule.minute = m;
    rule.second = 0;
    schedule.scheduleJob(rule, async () => {
      try {
        await Instagram.login();
      } catch (e) {
        console.log(e);
        logger.error(e);
        throw new NumerusError(JSON.stringify(e), "Instagrsm_FAILED_LOGIN");
      }
    });
  }

}
export default InstagramShare;
