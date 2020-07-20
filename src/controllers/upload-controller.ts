import { Article } from "../models/article-model";
import { Aphorism } from "../models/aphorism-model";
import { Gallery } from "../models/gallery-model";
import { Poem } from "../models/poem-model";
import { Contact } from "../models/contact-model";

class UploadController {
  static async upload(file: any) {
    let product: any;
    switch (file.type) {
      case "gallerys":
        product = await Gallery.getByGalleryId(file.imgObj.productId);
        break;
      case "poems":
        product = await Poem.getByPoemId(file.imgObj.productId);
        break;
      case "aphorism":
        product = await Aphorism.getByAphorismId(file.imgObj.productId);
        break;

      default:
        product = await Article.getByArticleId(file.imgObj.productId);
        break;
    }

    if (product) {
      product["originalImgName"] = file.imgObj.originalImgName;
      product["imgExtension"] = file.imgObj.imgExtension;
      product["imgObj"] = file.imgObj;
      product["imageData"] = file.imageData;
      await product.save();
    }
    return { imageNamesObj: file.imgObj };
  }
  static async uploadAphorism(file: any) {
    return { textData: file.textData };
  }
  static async uploadFile(file: any) {
    let product: any;
    switch (file.type) {
      case "contacts":
        product = await Contact.getById(file.fileObj.modelName);
        break;
      default:
        // product = await Article.getByArticleId(file.imgObj.productId);
        break;
    }

    if (product) {
      product["originalImgName"] = file.fileObj.originalFileName;
      product["fileExtension"] = file.fileObj.fileExtension;
      product["fileObj"] = file.fileObj;
      await product.save();
    }
    return { imageNamesObj: file.imgObj };
  }
  static async uploadService(file: any) {
    return { textData: file.textData };
  }
}

export default UploadController;
