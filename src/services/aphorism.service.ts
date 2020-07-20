import fs from "fs";
import path from "path";
import formidable from "formidable";
import { NextFunction, response } from "express";
import logger from "../shared/logger";
import { NumerusError } from "../shared/errors";
import Env from "../../env";
import { responseSender } from "../helper/helper";
const jimp = require("jimp");
import { UltimateTextToImage, getCanvasImage } from "ultimate-text-to-image";

export async function imageCreator(
  aphorismId: any,
  aphorismData: any,
  lang: string,
  isReturn?: boolean
): Promise<any> {
  try {
    const aphorismFontSize: number = aphorismData['aphorismFontSize'] ? aphorismData['aphorismFontSize'] : 36;
    const aphorismWith: number = aphorismData['aphorismWith']? aphorismData['aphorismWith'] : 700;
    const aphorismHeight: number = aphorismData['aphorismHeight']? aphorismData['aphorismHeight'] : 500;
    if (!fs.existsSync(path.join(__dirname, "..", "..", `/assets/images`))) {
      fs.mkdirSync(path.join(__dirname, "..", "..", `/assets/images`));
    }
    if (
      !fs.existsSync(
        path.join(__dirname, "..", "..", `/assets/images/aphorism`)
      )
    ) {
      fs.mkdirSync(path.join(__dirname, "..", "..", `/assets/images/aphorism`));
    }
    const fileDir = path.join(
      __dirname,
      "..",
      "..",
      `/assets/images/aphorism/${aphorismId}`
    );
    if (fs.existsSync(fileDir)) {
      if (isReturn) {
        return;
      }
      // fs.readdirSync(fileDir).forEach((f) => fs.unlinkSync(`${fileDir}/${f}`));
      // fs.rmdirSync(fileDir);
    } else {
      fs.mkdirSync(fileDir);
    }
    
    const filePath = path.join(fileDir, `${aphorismId}${lang}.jpg`);
    const logoPath = path.join(__dirname, "..", "..", "assets/logo/logo.png");
    const font = path.join(
      __dirname,
      "..",
      "..",
      "assets/fonts/Montserrat-Bold.fnt"
    );
    let logo = await jimp.read(logoPath);
    const aphPath = path.join(
      __dirname,
      "..",
      "..",
      "assets/aphorism/aphorusm.png"
    );
    const textToImage: any = new UltimateTextToImage(aphorismData.text[lang], {
      maxWidth: 800,
      width: aphorismWith,
      maxHeight: 600,
      height: aphorismHeight,
      fontSize: aphorismFontSize,
      lineHeight: 1.5*aphorismFontSize ,
      fontFamily: "Arial, Sans",
      align: "center",
      valign: "middle",
      fontColor: "#ffffff",      
    })
    textToImage.render()
      .toFile(aphPath);
    const width = textToImage.width; // final canvas size
    const height = textToImage.height; // final canvas size
    const renderedTime = textToImage.renderedTime; // rendering time of canvas
    const measuredParagraph = textToImage.measuredParagraph; // all the details of the texts in size
    const canvas = textToImage.canvas; // the node-canvas
    const hasRendered = textToImage.hasRendered; // a flag to indicate if render() has run

    // render again (this will create a new canvas)
    const options = (textToImage.options.fontFamily = "Comic Sans MS");
    const buffer = textToImage.render().toBuffer("image/jpeg");
    const aphorismImg = await jimp.read(aphPath);
    // const aphorismImg = textToImage.render().toBuffer("image/jpeg");
    const bgImagePath = path.join(
      __dirname,
      "..",
      "..",
      "assets/aphorism/aphorism_bg.jpg"
    );
    let bgImage = await jimp.read(bgImagePath);
    bgImage.resize(1200, 900);
    bgImage.composite(
      logo,
      bgImage.bitmap.width - 200,
      bgImage.bitmap.height - 200,
      {
        mode: jimp.BLEND_SOURCE_OVER,
        opacityDest: 1,
        opacitySource: 0.9,
      }
    );
    const fontLogo = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
    await bgImage.print(fontLogo, bgImage.bitmap.width - 190, bgImage.bitmap.height - 50, {
      text: 'youandworld.am',
      alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
  }, 150, 25);
    bgImage.composite(aphorismImg, (1200 - width)/2, (900 - height)/2, {
      mode: jimp.BLEND_SOURCE_OVER,
      opacityDest: 1,
      opacitySource: 1,
    });

    // const loadedFont = await jimp.loadFont(font);

    // await bgImage.print(
    //   loadedFont,
    //   200,
    //   200,
    //   {
    //     text: String(message),
    //     alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
    //   },
    //   800,
    //   600
    // );
    await bgImage.write(filePath);
  } catch (e) {
    new NumerusError("Unsupported upload file type", "NUMERUS_VALIDATION");
  }
}
