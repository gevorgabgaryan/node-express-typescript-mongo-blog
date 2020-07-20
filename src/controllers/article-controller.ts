import { Article, IArticleDocument } from "../models/article-model";
import { ArticleOld, IArticleOldDocument } from "../models/article-old-model";
import { NumerusError } from "../shared/errors";
import Env from "../../env";
import { Types } from "mongoose";
import { Setting } from "../models/settings-model";
import moment from "moment";
import random from "random";
import path from "path";
import fs from "fs";
import Telegram from "../telegram/telegram";
import { imageInit, oldImageInit } from "../shared/upload";

class ArticleController {
  static async initImages() {
    // await ArticleController.oldArticles();
    try {
      const items: IArticleDocument[] | null = await Article.find();
      if (!items || !items.length) {
        return;
      }

      for (let article of items) {
        await imageInit(article, "articles", article.articleId);
      }
    } catch (err) {
      console.log(err);
    }
  }
  static async oldArticles() {
    try {
      const items: IArticleOldDocument[] | null = await ArticleOld.find();
      if (!items || !items.length) {
        return;
      }
      for (const item of items) {
        if (item) {
          let catObj: any;
          switch (item.category_id) {
            case "2":
              catObj = {
                en: "motivation",
                ru: "мотивация",
                hy: "մոտիվացիա",
              };
              break;
            default:
              catObj = {
                en: "success",
                ru: "успех",
                hy: "հաջողություն",
              };
          }
          const articleData = {
            title: { en: item.title_en, ru: item.title_ru, hy: item.title_hy },
            desc: { en: item.desc_en, ru: item.desc_ru, hy: item.desc_hy },
            text: { en: item.text_en, ru: item.text_ru, hy: item.text_hy },
            keywords: {
              en: item.keywords_en,
              ru: item.keywords_ru,
              hy: item.keywords_hy,
            },
            alias: {},
            visible: true,
            articleId: "",
            img: "",
            category: catObj,
            author: {
              en: "You and World",
              ru: "Ты и мир",
              hy: "Դուք և աշխարհը",
            },
          };
          const date = new Date(2010, 8, 15, 11, 11, 11, 11);
          const created = await Setting.get(
            "lastArticleDate",
            `${date.getTime()}`
          );
          const article = new Article({
            title: articleData.title,
            desc: articleData.desc,
            text: articleData.text,
            keywords: articleData.keywords,
            alias: articleData.alias,
            visible: articleData.visible,
            category: articleData.category,
            author: articleData.author,
            createdAt: created,
          });

          const articleIds = await Article.find().select("articleId").exec();
          const articleIdArr = articleIds.map((i) => i.articleId);
          let currentArticleNumber: any;
          let isRemoved = false;
          let currentArticle = Env.firstArticleId;
          for (let i = 0; i < articleIdArr.length; ++i) {
            if (!articleIdArr.includes(`${currentArticle}`)) {
              isRemoved = true;
              currentArticleNumber = currentArticle;
              article.articleId = `${currentArticleNumber}`;
              break;
            }
            currentArticle += +Env.articleIdChangeStap;
          }
          if (!isRemoved) {
            currentArticleNumber = await Setting.get(
              "currentArticleNumber",
              Env.firstArticleId
            );
            article.articleId = `${currentArticleNumber}`;
            await Setting.set(
              "currentArticleNumber",
              +currentArticleNumber + +Env.articleIdChangeStap
            );
          }
          article.articleId = `${currentArticleNumber}`;
          const { imgObj, imageData } = await oldImageInit(
            article,
            item.img,
            "articles",
            article.articleId
          );
          article["originalImgName"] = imgObj.originalImgName;
          article["imgExtension"] = imgObj.imgExtension;
          article["imgObj"] = imgObj;
          article["imageData"] = imageData;
          await article.save();

          const newDate = new Date(+created).setDate(
            new Date(+created).getDate() + 1
          );
          const time = new Date(newDate).setHours(
            random.int(0, 24),
            random.int(0, 59),
            random.int(0, 59)
          );
          await Setting.set("lastArticleDate", `${new Date(time).getTime()}`);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async all(page: any, itemsPerPage: any, keyword: any) {
    try {
      const query: any = {};

      if (keyword && keyword.trim()) {
        keyword = keyword.trim();
        query.$or = [
          { title: new RegExp("^" + keyword, "i") },
          { lastName: new RegExp("^" + keyword, "i") },
          { email: new RegExp("^" + keyword, "i") },
        ];
        if (Types.ObjectId.isValid(keyword)) {
          query.$or.push({ _id: new Types.ObjectId(keyword) });
        }
      }

      const items: IArticleDocument[] | null = await Article.find(query)
        .select("-password")
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .sort({ _id: -1 })
        .exec();
      const total: number = await Article.countDocuments(query);
      return {
        items,
        total,
      };
    } catch (err) {
      console.log(err);
      throw new NumerusError(err.message, "REGISTER_FAILED");
    }
  }

  static async getArticles(
    page: any,
    itemsPerPage: any,
    lang: any,
    category: any,
    keyword: any,
    articleId: any,
    seenArticleIds: any
  ) {
    lang = lang ? lang : "hy";
    let searchFields = Env.searchFields.map((e) => `${e}.${lang}`);
    let query: any = {
      visible: true,
    };
     if (keyword) {
      searchFields = ["articleId", ...searchFields];
      let regex = new RegExp(`${keyword}`, `i`);
      query = {
        $or: searchFields.map((i) => {
          let obj = {};
          obj[i] = regex;
          return obj;
        }),
      };
    }

    if (category && category.length) {
      if (articleId) {
        query[`category.${lang}`] = { $in: JSON.parse(category) };
      } else {
        query[`category.en`] = { $in: JSON.parse(category) };
      }
    }
    if (seenArticleIds && seenArticleIds.length) {
      query.articleId = { $nin: (JSON.parse(seenArticleIds)).push(articleId) };
    }
    if (lang === "ru") {
      query["title.ru"] = { $ne: "ru" };
    }
    if (lang === "en") {
      query["title.en"] = { $ne: "en" };
    }

    const result = await Article.find(query)
      .sort({ _id: -1 })
      .select('-text, -imgObj, _id')
      .limit(itemsPerPage)
      .skip((page - 1) * itemsPerPage)
      .exec();
    if (+itemsPerPage === result.length) {
      let items = result.map((i) => {
        let article = {
          id: i._id,
          title: i.title && i.title[lang] ? i.title[lang] : "",
          desc: i.desc && i.desc[lang] ? i.desc[lang] : "",
          category: i.category && i.category[lang] ? i.category[lang] : "",
          author: i.author && i.author[lang] ? i.author[lang] : "",
          articleId: i.articleId,
           createdAt: i.createdAt,
        };
        return article;
      });
      const total = await Article.countDocuments(query);
      return {
        items,
        page,
        itemsPerPage,
        total,
      };
    } else {
      delete query.seenArticleIds;
      const result = await Article.find(query)
        .sort({ _id: -1 })
        .select('-text, -imgObj, _id')
        .limit(itemsPerPage)
        .skip((page - 1) * itemsPerPage)
        .exec();
      let items = result.map((i) => {
        let article = {
          id: i._id,
          title: i.title && i.title[lang] ? i.title[lang] : "",
          desc: i.desc && i.desc[lang] ? i.desc[lang] : "",
          category: i.category && i.category[lang] ? i.category[lang] : "",
          author: i.author && i.author[lang] ? i.author[lang] : "",
          articleId: i.articleId,
          createdAt: i.createdAt,
        };
        return article;
      });
      const total = await Article.countDocuments(query);
      return {
        items,
        page,
        itemsPerPage,
        total,
      };
    }
  }

  static async getArticleIds() {
    const items = await Article.find({})
      .select({ articleId: 1, _id: 0 })
      .sort({ _id: -1 })
      .exec();
    return items.map((e) => {
      const item = {
        params: {
          id: e.articleId,
        },
      };
      return item;
    });
  }

  static async getArticle(articleId: string, lang: any) {
    const article = await Article.getByArticleId(articleId);
    if (!article) {
      throw new NumerusError("Article not found", "NUMERUS_NOT_FOUND", null, {
        articleId,
      });
    }
    article.visitCount = +article.visitCount + 1;
    await article.save();
    const entArticle = {
      id: article._id,
      title: article.title && article.title[lang] ? article.title[lang] : "",
      desc: article.desc && article.desc[lang] ? article.desc[lang] : "",
      text: article.text && article.text[lang] ? article.text[lang] : "",
      keywords:
        article.keywords && article.keywords[lang]
          ? article.keywords[lang]
          : "",
      articleId: article.articleId,
      originalImgName: article.originalImgName,
      imgExtension: article.imgExtension,
      imgObj: article.imgObj,
      category:
        article.category && article.category[lang]
          ? article.category[lang]
          : "",
      author:
        article.author && article.author[lang] ? article.author[lang] : "",
      createdAt: article.createdAt,
    };
    return entArticle;
  }
  static async add(articleData: any) {
    const content = articleData.title["hy"];
    if (!content) {
      throw new NumerusError("Article content absent", "ADD_ARTICLE_FAILED");
    }

    const isExist = await Article.findOne({"title.hy": content.trim()});
    if (isExist) {
      throw new NumerusError(
        `Content exists ${content} ${content}`,
        "ADD_CONTENT_FAILED"
      );
    }
    const date = new Date(2010, 8, 15, 11, 11, 11, 11);
    const created = await Setting.get("lastArticleDate", `${date.getTime()}`);
    const article = new Article({
      title: articleData.title,
      desc: articleData.desc,
      text: articleData.text,
      keywords: articleData.keywords,
      alias: articleData.alias,
      visible: articleData.visible,
      category: articleData.category,
      author: articleData.author,
      createdAt: created,
    });
    const articleIds = await Article.find().select("articleId").exec();
    const articleIdArr = articleIds.map((i) => i.articleId);
    let currentArticleNumber: any;
    let isRemoved = false;
    let currentArticle = Env.firstArticleId;
    for (let i = 0; i < articleIdArr.length; ++i) {
      if (!articleIdArr.includes(`${currentArticle}`)) {
        isRemoved = true;
        currentArticleNumber = currentArticle;
        article.articleId = `${currentArticleNumber}`;
        break;
      }
      currentArticle += +Env.articleIdChangeStap;
    }
    if (!isRemoved) {
      currentArticleNumber = await Setting.get(
        "currentArticleNumber",
        Env.firstArticleId
      );
      article.articleId = `${currentArticleNumber}`;
      await Setting.set(
        "currentArticleNumber",
        +currentArticleNumber + +Env.articleIdChangeStap
      );
    }
    article.articleId = `${currentArticleNumber}`;
    await article.save();
    const newDate = new Date(+created).setDate(
      new Date(+created).getDate() + 1
    );
    const time = new Date(newDate).setHours(
      random.int(0, 24),
      random.int(0, 59),
      random.int(0, 59)
    );
    await Setting.set("lastArticleDate", `${new Date(time).getTime()}`);
    Telegram.notify("info", "Add article", article.articleId.toString(), {
      title: article.title["hy"],
    });
    return article.articleId;
  }
  static async edit(id: string, articleData: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NumerusError("Invalid ID", "NUMERUS_INVALID_ID");
    }

    const article = await Article.findById(id).select("-password").exec();
    if (!article) {
      throw new NumerusError("Article not found", "NUMERUS_USER_NOT_FOUND");
    }

    Object.keys(articleData).forEach((key) => {
      article[key] = articleData[key];
    });

    await article.save();
    return article;
  }
  static async remove(body: any) {
    const article = await Article.findById(body.id);
    if (!article) {
      throw new NumerusError("Article not found", "NUMERUS_NOT_FOUND", null, {
        id: body.id,
      });
    }

    const fileDir = path.join(
      __dirname,
      "..",
      "..",
      `/assets/images/articles/${article.articleId}`
    );
    if (fs.existsSync(fileDir)) {
      fs.readdirSync(fileDir).forEach((f) => fs.unlinkSync(`${fileDir}/${f}`));
      fs.rmdirSync(fileDir);
    }
    const articleDeleted = await article.deleteOne({ _id: body.id });
    Telegram.notify("info", "Remove article", article.articleId.toString(), {
      result: articleDeleted,
    });

    return article.articleId;
  }
}

export default ArticleController;
