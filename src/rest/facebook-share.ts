import { Aphorism, IAphorismDocument } from "../models/aphorism-model";
import { Article, IArticleDocument } from "../models/article-model";
import { Gallery, IGalleryDocument } from "../models/gallery-model";
import { Poem, IPoemDocument } from "../models/poem-model";
import Telegram from "../telegram/telegram";
import schedule from "node-schedule";
import logger from "../shared/logger";
import Facebook from "../facebook/facebook";
import Env from '../../env';
import { NumerusError } from "../shared/errors";

class FacebookShare {
    static async shareGallery(h: number,m: number) {
        const rule = new schedule.RecurrenceRule();
        rule.tz = 'Etc/UTC';
        rule.hour = h;
        rule.minute = m;
        rule.second = 0;
        schedule.scheduleJob(rule, async () => {
          try {
            let  gallery = await Gallery.fbNotSharedGallery();
            if (!gallery) {
               gallery = await Gallery.fbNotSecondSharedGallery();
               if (!gallery) {
                  await Gallery.updateMany({},{isFacebookSecondShared: false});
                  gallery = await Gallery.fbNotSecondSharedGallery();
               }
               gallery.isFacebookSecondShared = true;
            } else {
               gallery.isFacebookShared = true;
            }

             await gallery.save();
            const postId = await Facebook.postYouandworld(
              `${Env.website}gallery/${gallery.galleryId}/hy`,
              ""
            );
            const postId1 = await Facebook.postYourorinak(
                `${Env.website}gallery/${gallery.galleryId}/hy`,
                 ""
              );
              const postId2 = await Facebook.postMiniYou(
                `${Env.website}gallery/${gallery.galleryId}/hy`,
                 ""
              );
              const postId3 = await Facebook.postStyle(
                `${Env.website}gallery/${gallery.galleryId}/hy`,
               ""
              );
            // //   const postId4 = await Facebook.postProfileYou(
            //     `${Env.website}gallery/${gallery.galleryId}/hy`,
            //     gallery.desc["hy"] ? gallery.desc["hy"] : ""
            //   );
            const postId5 = await Facebook.postYouandworldNew(
              `${Env.website}gallery/${gallery.galleryId}/hy`,
              ""
            );

            if (postId) {
              Telegram.notify("info", "FacebookShare", "FacebookShare", {
                link: `${Env.website}gallery/${gallery.galleryId}/hy`,
              });
              gallery.isFacebookShared = true;
              gallery.facebookPostIds = [postId,postId1,postId2,postId3, postId5];
              await gallery.save();
            }
          } catch (e) {
            console.log(e);
            logger.error(e);
            throw new NumerusError((JSON.stringify(e)).slice(0, 20), "Facebook_FAILED");
          }
        });
      }

    static async sharePoem(h: number,m: number) {
        const rule = new schedule.RecurrenceRule();
        rule.tz = 'Etc/UTC';
        rule.hour = h;
        rule.minute = m;
        rule.second = 0;
        schedule.scheduleJob(rule, async () => {
          try {
            let poem = await Poem.fbNotSharedPoem();
            if (!poem) {
              poem = await Poem.fbNotSecondSharedPoem();
              if (!poem) {
                 await Poem.updateMany({},{isFacebookSecondShared: false});
                 poem = await Poem.fbNotSecondSharedPoem();
              }
              poem.isFacebookSecondShared = true;
           } else {
              poem.isFacebookShared = true;
           }
            await poem.save();
            const postId = await Facebook.postYouandworld(
              `${Env.website}poems/${poem.poemId}/hy`,
              poem.desc["hy"] ? poem.desc["hy"] : ""

            );
            const postId1 = await Facebook.postYourorinak(
                `${Env.website}poems/${poem.poemId}/hy`,
                 poem.desc["hy"] ? poem.desc["hy"] : ""
              );
              const postId2 = await Facebook.postMiniYou(
                `${Env.website}poems/${poem.poemId}/hy`,
                poem.desc["hy"] ? poem.desc["hy"] : ""
              );
              const postId3 = await Facebook.postStyle(
                `${Env.website}poems/${poem.poemId}/hy`,
                poem.desc["hy"] ? poem.desc["hy"] : ""
              );
              const postId5 = await Facebook.postYouandworldNew(
                `${Env.website}poems/${poem.poemId}/hy`,
                poem.desc["hy"] ? poem.desc["hy"] : ""

              );
            // //   const postId4 = await Facebook.postProfileYou(
            //     `${Env.website}poems/${article.articleId}/hy`,
            //     article.desc["hy"] ? article.desc["hy"] : ""
            //   );

            if (postId) {
              Telegram.notify("info", "FacebookShare", "FacebookShare", {
                link: `${Env.website}poems/${poem.poemId}/hy`,
                message: poem.desc["hy"],
              });
              poem.facebookPostIds = [postId,postId1,postId2,postId3, postId5];
              await poem.save();
            }
          } catch (e) {
            console.log(e);
            logger.error(e);
            throw new NumerusError((JSON.stringify(e)).slice(0, 20), "Facebook_FAILED");
          }
        });
      }

    static async shareAphorism(h: number,m: number) {
        const rule = new schedule.RecurrenceRule();
        rule.tz = 'Etc/UTC';
        rule.hour = h;
        rule.minute = m;
        rule.second = 0;
        schedule.scheduleJob(rule, async () => {
          try {
            let aphorism = await Aphorism.fbNotSharedAphorism();
            if (!aphorism) {
              aphorism = await Aphorism.fbNotSecondSharedAphorism();
              if (!aphorism) {
                 await Aphorism.updateMany({},{isFacebookSecondShared: false});
                 aphorism = await Aphorism.fbNotSecondSharedAphorism();
              }
              aphorism.isFacebookSecondShared = true;
           } else {
              aphorism.isFacebookShared = true;
           }
            aphorism.isFacebookShared = true;
            await aphorism.save();
            const postId = await Facebook.postYouandworld(
              `${Env.website}aphorisms/${aphorism.aphorismId}/hy`, ""

            );
            const postId1 = await Facebook.postYourorinak(
                `${Env.website}aphorisms/${aphorism.aphorismId}/hy`,
                 ""
              );
              const postId2 = await Facebook.postMiniYou(
                `${Env.website}aphorisms/${aphorism.aphorismId}/hy`,
                 ""
              );
              const postId3 = await Facebook.postStyle(
                `${Env.website}aphorisms/${aphorism.aphorismId}/hy`,
               ""
              );
            //   const postId4 = await Facebook.postProfileYou(
            //     `${Env.website}aphorisms/${aphorism.aphorismId}/hy`,
            //     aphorism.desc["hy"] ? aphorism.desc["hy"] : ""
            //   );

            const postId5 = await Facebook.postYouandworldNew(
              `${Env.website}aphorisms/${aphorism.aphorismId}/hy`, ""

            );

            if (postId) {
              Telegram.notify("info", "FacebookShare", "FacebookShare", {
                link: `${Env.website}aphorisms/${aphorism.aphorismId}/hy`,
                message: aphorism.desc["hy"],
              });
              aphorism.facebookPostIds = [postId,postId1,postId2,postId3, postId5];
              await aphorism.save();
            }
          } catch (e) {
            console.log(e);
            logger.error(e);
            throw new NumerusError((JSON.stringify(e)).slice(0, 20), "Facebook_FAILED");
          }
        });
      }

  static async shareArticle(h: number,m: number) {
    const rule = new schedule.RecurrenceRule();
    rule.tz = 'Etc/UTC';
    rule.hour = h;
    rule.minute = m;
    rule.second = 0;
    schedule.scheduleJob(rule, async () => {
      try {
        let article = await Article.fbNotSharedArticle();
        if (!article) {
          article = await Article.fbNotSecondSharedArticle();
          if (!article) {
             await Article.updateMany({},{isFacebookSecondShared: false});
             article = await Article.fbNotSecondSharedArticle();
          }
          article.isFacebookSecondShared = true;
       } else {
          article.isFacebookShared = true;
       }
       await article.save();
        const postId = await Facebook.postYouandworld(
          `${Env.website}articles/${article.articleId}/hy`,
          article.desc["hy"] ? article.desc["hy"] : ""
        );
        const postId1 = await Facebook.postYourorinak(
            `${Env.website}articles/${article.articleId}/hy`,
            article.desc["hy"] ? article.desc["hy"] : ""
          );
          const postId2 = await Facebook.postMiniYou(
            `${Env.website}articles/${article.articleId}/hy`,
            article.desc["hy"] ? article.desc["hy"] : ""
          );
          const postId3 = await Facebook.postStyle(
            `${Env.website}articles/${article.articleId}/hy`,
            article.desc["hy"] ? article.desc["hy"] : ""
          );
          const postId5 = await Facebook.postYouandworldNew(
            `${Env.website}articles/${article.articleId}/hy`,
            article.desc["hy"] ? article.desc["hy"] : ""
          );
        //   const postId4 = await Facebook.postProfileYou(
        //     `${Env.website}articles/${article.articleId}/hy`,
        //     article.desc["hy"] ? article.desc["hy"] : ""
        //   );

        if (postId) {
          Telegram.notify("info", "FacebookShare", "FacebookShare", {
            link: `${Env.website}articles/${article.articleId}/hy`,
            message: article.desc["hy"],
          });
        article.facebookPostIds = [postId,postId1,postId2,postId3,postId5];
          await article.save();
        }
      } catch (e) {
        console.log(e);
        logger.error(e);
        throw new NumerusError((JSON.stringify(e)).slice(0, 20), "Facebook_FAILED");
      }
    });
  }

}
export default FacebookShare;
