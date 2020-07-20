import fs from "fs";
import path from "path";
import formidable from "formidable";
import vision from "@google-cloud/vision";
import { NextFunction, response } from "express";
import logger from "./logger";
import { NumerusError } from "./errors";
import Env from "../../env";
import { responseSender } from "../helper/helper";

const jimp = require("jimp");

export function imageResizer(): any {
  try {
    return async (req: any, res: any, next: NextFunction) => {
      try {
        const logoPath = path.join(
          __dirname,
          "..",
          "..",
          "assets/logo/logo.png"
        );
        let logo = await jimp.read(logoPath);
        // logo.resize(130, 45);
        const form = new formidable.IncomingForm();
        const fileName = Date.now();
        let extension = "";
        let fileType = "";
        let originalImgName = "";
        let imageData: any;
        let type: string = "article";

        form.parse(req, async (err: any, fields: any, files: any) => {
          const file = files["file"];
          const name = fields["name"];
          type = fields["type"];
          originalImgName = file.originalFilename;
          const imgNamesObj: any = {
            originalImgName,
            productId: name,
          };
          try {
            switch (file.mimetype) {
              case "application/pdf":
                extension = "pdf";
                fileType = "document";
                break;
              case "application/jpeg":
                extension = "jpg";
                fileType = "image";
                break;
              case "image/jpeg":
                extension = "jpg";
                fileType = "image";
                break;
              case "image/png":
                extension = "png";
                fileType = "image";
                break;
              case "text/plain":
                extension = "txt";
                fileType = "document";
                break;
              default:
                extension = "";
                break;
            }
            imgNamesObj["imgExtension"] = extension;
            if (extension === "") {
              throw new NumerusError(
                "Unsupported upload file type",
                "NUMERUS_VALIDATION"
              );
            }
            const font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
            if (
              !fs.existsSync(path.join(__dirname, "..", "..", `/assets/images`))
            ) {
              fs.mkdirSync(path.join(__dirname, "..", "..", `/assets/images`));
            }
            if (
              !fs.existsSync(
                path.join(__dirname, "..", "..", `/assets/images/${type}`)
              )
            ) {
              fs.mkdirSync(
                path.join(__dirname, "..", "..", `/assets/images/${type}`)
              );
            }

            const fileDir = path.join(
              __dirname,
              "..",
              "..",
              `/assets/images/${type}/${name}`
            );
            if (fs.existsSync(fileDir)) {
              fs.readdirSync(fileDir).forEach((f) =>
                fs.unlinkSync(`${fileDir}/${f}`)
              );
              fs.rmdirSync(fileDir);
            }

            fs.mkdirSync(fileDir);
            if (originalImgName) {
              const filePath = path.join(fileDir, originalImgName);
              imgNamesObj.original = originalImgName;
              fs.copyFileSync(file.filepath, filePath);
            }

            const filePath = path.join(
              fileDir,
              `original_${name}.${extension}`
            );
            const productLogoPath = path.join(
              fileDir,
              `original_product_${name}.${extension}`
            );

            imgNamesObj.original = `original_${name}.${extension}`;
            imgNamesObj.originalLogo = `original_article_${name}.${extension}`;
            fs.copyFileSync(file.filepath, filePath);

            const image = await jimp.read(file.filepath);
            image.getBase64(jimp.AUTO, (err: any, base64Image: any) => {
              imageData = base64Image;
            });

            await image.print(
              font,
              image.bitmap.width - 150,
              image.bitmap.height - 25,
              {
                text: "youandworld.am",
                alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
              },
              150,
              25
            );

            if (image.bitmap.width < 500 || image.bitmap.height < 500) {
              const logo = await jimp.read(logoPath);
              logo.resize(90, 90);
              image.composite(
                logo,
                image.bitmap.width - 100,
                image.bitmap.height - 100,
                {
                  mode: jimp.BLEND_SOURCE_OVER,
                  opacityDest: 1,
                  opacitySource: 1,
                }
              );
              await image.print(
                font,
                image.bitmap.width - 150,
                image.bitmap.height - 25,
                {
                  text: "youandworld.am",
                  alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
                  alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
                },
                150,
                25
              );
              image.write(productLogoPath);
            } else {
              image.composite(
                logo,
                image.bitmap.width - 180,
                image.bitmap.height - 180,
                {
                  mode: jimp.BLEND_SOURCE_OVER,
                  opacityDest: 1,
                  opacitySource: 0.9,
                }
              );
              await image.print(
                font,
                image.bitmap.width - 150,
                image.bitmap.height - 25,
                {
                  text: "youandworld.am",
                  alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
                  alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
                },
                150,
                25
              );
              image.write(productLogoPath);
            }
            if (extension === "pdf" || extension === "txt") {
              return {
                name: `${fileName}.${extension}`,
                fileType: fileType,
              };
            } else {
              if (extension === "jpg" && Env.upload.convertJpgToPng) {
                const logoPathPng = path.join(
                  fileDir,
                  `original_product_${name}.png`
                );
                imgNamesObj.originalPng = `original_${name}.png`;
                const image = await jimp.read(file.filepath);
                if (image.bitmap.width < 500 || image.bitmap.height < 500) {
                  const logo = await jimp.read(logoPath);
                  logo.resize(90, 90);
                  image.composite(
                    logo,
                    image.bitmap.width - 100,
                    image.bitmap.height - 100,
                    {
                      mode: jimp.BLEND_SOURCE_OVER,
                      opacityDest: 1,
                      opacitySource: 0.9,
                    }
                  );
                  await image.print(
                    font,
                    image.bitmap.width - 150,
                    image.bitmap.height - 25,
                    {
                      text: "youandworld.am",
                      alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
                      alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
                    },
                    150,
                    25
                  );
                } else {
                  image.composite(
                    logo,
                    image.bitmap.width - 180,
                    image.bitmap.height - 180,
                    {
                      mode: jimp.BLEND_SOURCE_OVER,
                      opacityDest: 1,
                      opacitySource: 0.9,
                    }
                  );
                  await image.print(
                    font,
                    image.bitmap.width - 150,
                    image.bitmap.height - 25,
                    {
                      text: "youandworld.am",
                      alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
                      alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
                    },
                    150,
                    25
                  );
                }
                image.write(logoPathPng);
              }
            }
            let processedCount = 0;
            for (const dim of Env.upload.sizes) {
              const fileDirDim = path.join(
                __dirname,
                "..",
                "..",
                `/assets/images/${type}/${name}`
              );
              const img = await jimp.read(file.filepath);

              const oWidth = img.bitmap.width;
              const oHeight = img.bitmap.height;
              let width = dim.width;
              let height = dim.height;
              if (oWidth > oHeight) {
                const offset = (oWidth - oHeight) / 2;
                img.crop(offset, 0, oHeight, oHeight);
              }

              if (oWidth < oHeight) {
                const offset = (oHeight - oWidth) / 2;
                img.crop(0, offset, oWidth, oWidth);
              }

              img.resize(width, height);
              if (dim.height > 700 && width > 700) {
                img.composite(logo, width - 180, height - 180, {
                  mode: jimp.BLEND_SOURCE_OVER,
                  opacityDest: 1,
                  opacitySource: 0.9,
                });
              } else if (dim.height > 500 && width > 500) {
                img.composite(logo, width - 180, height - 180, {
                  mode: jimp.BLEND_SOURCE_OVER,
                  opacityDest: 1,
                  opacitySource: 0.9,
                });
                await img.print(
                  font,
                  width - 150,
                  height - 25,
                  {
                    text: "youandworld.am",
                    alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
                  },
                  150,
                  25
                );
              } else if (dim.height > 250 && width > 250) {
                const logo = await jimp.read(logoPath);
                logo.resize(90, 90);
                img.composite(logo, width - 100, height - 100, {
                  mode: jimp.BLEND_SOURCE_OVER,
                  opacityDest: 1,
                  opacitySource: 0.9,
                });
                await img.print(
                  font,
                  width - 150,
                  height - 25,
                  {
                    text: "youandworld.am",
                    alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
                  },
                  150,
                  25
                );
              }

              const filePathDim = path.resolve(
                fileDirDim,
                `${dim.name}.${extension}`
              );
              imgNamesObj[
                `${dim.name}_${fileName}`
              ] = `${dim.name}.${extension}`;
              img.write(filePathDim);
              if (extension === "jpg" && Env.upload.convertJpgToPng) {
                const filePathDim = path.resolve(fileDirDim, `${dim.name}.png`);
                imgNamesObj[`${dim.name}_${fileName}`] = `${dim.name}.png`;
                img.write(filePathDim);
              }
            }
            req.file = {};
            req.file.imgObj = imgNamesObj;
            req.file.imageData = imageData;
            req.file.type = type;
            next();
          } catch (e) {
            console.log(239, e);
            responseSender(
              new NumerusError(
                "Unsupported upload file type",
                "NUMERUS_VALIDATION",
                null,
                { error: e }
              ),
              res
            );
          }
        });
        /*,(err, fields, files) => {

                    }*/
      } catch (e) {
        console.log(e);
        responseSender(
          new NumerusError(
            "Unsupported upload file type",
            "NUMERUS_VALIDATION"
          ),
          res
        );
      }
    };
  } catch (e) {
    console.log(e);
  }
}

export function imageTextExtract(): any {
  const jsonPath = path.join(__dirname, "..", "..", "assets/google.json");
  const client = new vision.ImageAnnotatorClient({ keyFilename: jsonPath });
  try {
    return async (req: any, res: any, next: NextFunction) => {
      try {
        const logoPath = path.join(
          __dirname,
          "..",
          "..",
          "assets/logo/logo.png"
        );
        let logo = await jimp.read(logoPath);
        // logo.resize(130, 45);
        const form = new formidable.IncomingForm();
        const fileName = Date.now();
        let extension = "";
        let fileType = "";
        let originalImgName = "";
        let textData: any;
        let type: string = "article";

        form.parse(req, async (err: any, fields: any, files: any) => {
          const file = files["file"];
          originalImgName = file.originalFilename;
          try {
            switch (file.mimetype) {
              case "application/pdf":
                extension = "pdf";
                fileType = "document";
                break;
              case "application/jpeg":
                extension = "jpg";
                fileType = "image";
                break;
              case "image/jpeg":
                extension = "jpg";
                fileType = "image";
                break;
              case "image/png":
                extension = "png";
                fileType = "image";
                break;
              case "text/plain":
                extension = "txt";
                fileType = "document";
                break;
              default:
                extension = "";
                break;
            }

            if (extension === "") {
              throw new NumerusError(
                "Unsupported upload file type",
                "NUMERUS_VALIDATION"
              );
            }
            const response: any = await client.textDetection(file.filepath);
            const result: any = response[0];
            req.file = {};
            req.file.textData = {
              lang: result.textAnnotations[0].locale,
              text: result.fullTextAnnotation.text,
            };
            next();
          } catch (e) {
            console.log(239, e);
            responseSender(
              new NumerusError(
                "Unsupported upload file type",
                "NUMERUS_VALIDATION",
                null,
                { error: e }
              ),
              res
            );
          }
        });
        /*,(err, fields, files) => {

                    }*/
      } catch (e) {
        console.log(e);
        responseSender(
          new NumerusError(
            "Unsupported upload file type",
            "NUMERUS_VALIDATION"
          ),
          res
        );
      }
    };
  } catch (e) {
    console.log(e);
  }
}

export async function imageInit(
  articleData: any,
  type: string,
  name: any
): Promise<any> {
  try {
    if (!articleData.imageData) {
      return;
    }
    const splitted = articleData.imageData.split(",");
    const [, imgString] = splitted;
    const imgBuffer = Buffer.from(imgString, "base64");
    const logoPath = path.join(__dirname, "..", "..", "assets/logo/logo.png");
    let logo = await jimp.read(logoPath);
    // logo.resize(130, 45);

    const fileName = Date.now();
    let extension = articleData.imgObj.imgExtension;
    let imageData: any;

    const originalImgName = articleData.imgObj.originalImgName;
    const font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
    if (!fs.existsSync(path.join(__dirname, "..", "..", `/assets/images`))) {
      fs.mkdirSync(path.join(__dirname, "..", "..", `/assets/images`));
    }
    if (
      !fs.existsSync(path.join(__dirname, "..", "..", `/assets/images/${type}`))
    ) {
      fs.mkdirSync(path.join(__dirname, "..", "..", `/assets/images/${type}`));
    }

    const fileDir = path.join(
      __dirname,
      "..",
      "..",
      `/assets/images/${type}/${name}`
    );
    if (fs.existsSync(fileDir)) {
      return;
      // fs.readdirSync(fileDir).forEach((f) =>
      //   fs.unlinkSync(`${fileDir}/${f}`)
      // );
      // fs.rmdirSync(fileDir);
    }

    fs.mkdirSync(fileDir);

    if (originalImgName) {
      const filePath = path.join(fileDir, originalImgName);
      fs.writeFileSync(filePath, imgBuffer);
    }

    const filePath = path.join(fileDir, `original_${name}.${extension}`);
    const productLogoPath = path.join(
      fileDir,
      `original_product_${name}.${extension}`
    );

    fs.writeFileSync(filePath, imgBuffer);

    const image = await jimp.read(imgBuffer);
    image.getBase64(jimp.AUTO, (err: any, base64Image: any) => {
      imageData = base64Image;
    });

    await image.print(
      font,
      image.bitmap.width - 150,
      image.bitmap.height - 25,
      {
        text: "youandworld.am",
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
      },
      150,
      25
    );

    if (image.bitmap.width < 500 || image.bitmap.height < 500) {
      const logo = await jimp.read(logoPath);
      logo.resize(90, 90);
      image.composite(
        logo,
        image.bitmap.width - 100,
        image.bitmap.height - 100,
        {
          mode: jimp.BLEND_SOURCE_OVER,
          opacityDest: 1,
          opacitySource: 1,
        }
      );
      await image.print(
        font,
        image.bitmap.width - 150,
        image.bitmap.height - 25,
        {
          text: "youandworld.am",
          alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
        },
        150,
        25
      );
      image.write(productLogoPath);
    } else {
      image.composite(
        logo,
        image.bitmap.width - 180,
        image.bitmap.height - 180,
        {
          mode: jimp.BLEND_SOURCE_OVER,
          opacityDest: 1,
          opacitySource: 0.9,
        }
      );
      await image.print(
        font,
        image.bitmap.width - 150,
        image.bitmap.height - 25,
        {
          text: "youandworld.am",
          alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
        },
        150,
        25
      );
      image.write(productLogoPath);
    }

    if (extension === "jpg" && Env.upload.convertJpgToPng) {
      const logoPathPng = path.join(fileDir, `original_product_${name}.png`);

      const image = await jimp.read(imgBuffer);
      if (image.bitmap.width < 500 || image.bitmap.height < 500) {
        const logo = await jimp.read(logoPath);
        logo.resize(90, 90);
        image.composite(
          logo,
          image.bitmap.width - 100,
          image.bitmap.height - 100,
          {
            mode: jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 0.9,
          }
        );
        await image.print(
          font,
          image.bitmap.width - 150,
          image.bitmap.height - 25,
          {
            text: "youandworld.am",
            alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
          },
          150,
          25
        );
      } else {
        image.composite(
          logo,
          image.bitmap.width - 180,
          image.bitmap.height - 180,
          {
            mode: jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 0.9,
          }
        );
        await image.print(
          font,
          image.bitmap.width - 150,
          image.bitmap.height - 25,
          {
            text: "youandworld.am",
            alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
          },
          150,
          25
        );
      }
      image.write(logoPathPng);
    }

    for (const dim of Env.upload.sizes) {
      const fileDirDim = path.join(
        __dirname,
        "..",
        "..",
        `/assets/images/${type}/${name}`
      );
      const img = await jimp.read(imgBuffer);

      const oWidth = img.bitmap.width;
      const oHeight = img.bitmap.height;
      let width = dim.width;
      let height = dim.height;
      if (oWidth > oHeight) {
        const offset = (oWidth - oHeight) / 2;
        img.crop(offset, 0, oHeight, oHeight);
      }

      if (oWidth < oHeight) {
        const offset = (oHeight - oWidth) / 2;
        img.crop(0, offset, oWidth, oWidth);
      }

      img.resize(width, height);
      if (dim.height > 700 && width > 700) {
        img.composite(logo, width - 180, height - 180, {
          mode: jimp.BLEND_SOURCE_OVER,
          opacityDest: 1,
          opacitySource: 0.9,
        });
      } else if (dim.height > 500 && width > 500) {
        img.composite(logo, width - 180, height - 180, {
          mode: jimp.BLEND_SOURCE_OVER,
          opacityDest: 1,
          opacitySource: 0.9,
        });
        await img.print(
          font,
          width - 150,
          height - 25,
          {
            text: "youandworld.am",
            alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
          },
          150,
          25
        );
      } else if (dim.height > 250 && width > 250) {
        const logo = await jimp.read(logoPath);
        logo.resize(90, 90);
        img.composite(logo, width - 100, height - 100, {
          mode: jimp.BLEND_SOURCE_OVER,
          opacityDest: 1,
          opacitySource: 0.9,
        });
        await img.print(
          font,
          width - 150,
          height - 25,
          {
            text: "youandworld.am",
            alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
          },
          150,
          25
        );
      }

      const filePathDim = path.resolve(fileDirDim, `${dim.name}.${extension}`);

      img.write(filePathDim);
      if (extension === "jpg" && Env.upload.convertJpgToPng) {
        const filePathDim = path.resolve(fileDirDim, `${dim.name}.png`);

        img.write(filePathDim);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

export async function basaImageInit(
  pathUrl: any,
  imageName: any,
  type: string,
  id: any
): Promise<any> {
  const oldImagePath = pathUrl;

  if (!oldImagePath) {
    return;
  }

  const logoPath = path.join(__dirname, "..", "..", "assets/logo/logo.png");
  let logo = await jimp.read(logoPath);
  // logo.resize(130, 45);
  let imageData: any;
  const fileName = Date.now();
  let extension = imageName.split(".")[1];
  let originalImgName = imageName;

  const name = id;
  originalImgName = imageName;
  const imgNamesObj: any = {
    originalImgName,
    productId: name,
  };

  imgNamesObj["imgExtension"] = extension;
  if (extension === "") {
    throw new NumerusError(
      "Unsupported upload file type",
      "NUMERUS_VALIDATION"
    );
  }
  const font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
  if (!fs.existsSync(path.join(__dirname, "..", "..", `/assets/images`))) {
    fs.mkdirSync(path.join(__dirname, "..", "..", `/assets/images`));
  }
  if (
    !fs.existsSync(path.join(__dirname, "..", "..", `/assets/images/${type}`))
  ) {
    fs.mkdirSync(path.join(__dirname, "..", "..", `/assets/images/${type}`));
  }

  const fileDir = path.join(
    __dirname,
    "..",
    "..",
    `/assets/images/${type}/${id}`
  );
  if (fs.existsSync(fileDir)) {
    fs.readdirSync(fileDir).forEach((f) => fs.unlinkSync(`${fileDir}/${f}`));
    fs.rmdirSync(fileDir);
  }

  fs.mkdirSync(fileDir);
  // if (originalImgName) {
  //   const filePath = path.join(fileDir, originalImgName);
  //   imgNamesObj.original = originalImgName;
  //   fs.copyFileSync(oldImagePath, filePath);
  // }

  const filePath = path.join(fileDir, `original_${name}.${extension}`);
  const productLogoPath = path.join(
    fileDir,
    `original_product_${name}.${extension}`
  );

  imgNamesObj.original = `original_${name}.${extension}`;
  imgNamesObj.originalLogo = `original_article_${name}.${extension}`;
  fs.copyFileSync(oldImagePath, filePath);

  const image = await jimp.read(oldImagePath);
  image.getBase64(jimp.AUTO, (err: any, base64Image: any) => {
    imageData = base64Image;
  });

  await image.print(
    font,
    image.bitmap.width - 150,
    image.bitmap.height - 25,
    {
      text: "youandworld.am",
      alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
    },
    150,
    25
  );

  if (image.bitmap.width < 500 || image.bitmap.height < 500) {
    const logo = await jimp.read(logoPath);
    logo.resize(90, 90);
    image.composite(logo, image.bitmap.width - 100, image.bitmap.height - 100, {
      mode: jimp.BLEND_SOURCE_OVER,
      opacityDest: 1,
      opacitySource: 1,
    });
    await image.print(
      font,
      image.bitmap.width - 150,
      image.bitmap.height - 25,
      {
        text: "youandworld.am",
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
      },
      150,
      25
    );
    image.write(productLogoPath);
  } else {
    image.composite(logo, image.bitmap.width - 180, image.bitmap.height - 180, {
      mode: jimp.BLEND_SOURCE_OVER,
      opacityDest: 1,
      opacitySource: 0.9,
    });
    await image.print(
      font,
      image.bitmap.width - 150,
      image.bitmap.height - 25,
      {
        text: "youandworld.am",
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
      },
      150,
      25
    );
    image.write(productLogoPath);
  }
// return
  // if (extension === "jpg" && Env.upload.convertJpgToPng) {
  //   const logoPathPng = path.join(fileDir, `original_product_${name}.png`);
  //   imgNamesObj.originalPng = `original_${name}.png`;
  //   const image = await jimp.read(oldImagePath);
  //   if (image.bitmap.width < 500 || image.bitmap.height < 500) {
  //     const logo = await jimp.read(logoPath);
  //     logo.resize(90, 90);
  //     image.composite(
  //       logo,
  //       image.bitmap.width - 100,
  //       image.bitmap.height - 100,
  //       {
  //         mode: jimp.BLEND_SOURCE_OVER,
  //         opacityDest: 1,
  //         opacitySource: 0.9,
  //       }
  //     );
  //     await image.print(
  //       font,
  //       image.bitmap.width - 150,
  //       image.bitmap.height - 25,
  //       {
  //         text: "youandworld.am",
  //         alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
  //         alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
  //       },
  //       150,
  //       25
  //     );
  //   } else {
  //     image.composite(
  //       logo,
  //       image.bitmap.width - 180,
  //       image.bitmap.height - 180,
  //       {
  //         mode: jimp.BLEND_SOURCE_OVER,
  //         opacityDest: 1,
  //         opacitySource: 0.9,
  //       }
  //     );
  //     await image.print(
  //       font,
  //       image.bitmap.width - 150,
  //       image.bitmap.height - 25,
  //       {
  //         text: "youandworld.am",
  //         alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
  //         alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
  //       },
  //       150,
  //       25
  //     );
  //   }
  //   image.write(logoPathPng);
  // }

  // let processedCount = 0;
  // for (const dim of Env.upload.sizes) {
  //   const fileDirDim = path.join(
  //     __dirname,
  //     "..",
  //     "..",
  //     `/assets/images/${type}/${name}`
  //   );
  //   const img = await jimp.read(oldImagePath);

  //   const oWidth = img.bitmap.width;
  //   const oHeight = img.bitmap.height;
  //   let width = dim.width;
  //   let height = dim.height;
  //   if (oWidth > oHeight) {
  //     const offset = (oWidth - oHeight) / 2;
  //     img.crop(offset, 0, oHeight, oHeight);
  //   }

  //   if (oWidth < oHeight) {
  //     const offset = (oHeight - oWidth) / 2;
  //     img.crop(0, offset, oWidth, oWidth);
  //   }

  //   img.resize(width, height);
  //   if (dim.height > 700 && width > 700) {
  //     img.composite(logo, width - 180, height - 180, {
  //       mode: jimp.BLEND_SOURCE_OVER,
  //       opacityDest: 1,
  //       opacitySource: 0.9,
  //     });
  //   } else if (dim.height > 500 && width > 500) {
  //     img.composite(logo, width - 180, height - 180, {
  //       mode: jimp.BLEND_SOURCE_OVER,
  //       opacityDest: 1,
  //       opacitySource: 0.9,
  //     });
  //     await img.print(
  //       font,
  //       width - 150,
  //       height - 25,
  //       {
  //         text: "youandworld.am",
  //         alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
  //         alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
  //       },
  //       150,
  //       25
  //     );
  //   } else if (dim.height > 250 && width > 250) {
  //     const logo = await jimp.read(logoPath);
  //     logo.resize(90, 90);
  //     img.composite(logo, width - 100, height - 100, {
  //       mode: jimp.BLEND_SOURCE_OVER,
  //       opacityDest: 1,
  //       opacitySource: 0.9,
  //     });
  //     await img.print(
  //       font,
  //       width - 150,
  //       height - 25,
  //       {
  //         text: "youandworld.am",
  //         alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
  //         alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
  //       },
  //       150,
  //       25
  //     );
  //   }

  //   const filePathDim = path.resolve(fileDirDim, `${dim.name}.${extension}`);
  //   imgNamesObj[`${dim.name}_${fileName}`] = `${dim.name}.${extension}`;
  //   img.write(filePathDim);
  //   if (extension === "jpg" && Env.upload.convertJpgToPng) {
  //     const filePathDim = path.resolve(fileDirDim, `${dim.name}.png`);
  //     imgNamesObj[`${dim.name}_${fileName}`] = `${dim.name}.png`;
  //     img.write(filePathDim);
  //   }
  // }
  return { imgObj: imgNamesObj, imageData };
}

export async function oldImageInit(
  article: any,
  imageName: any,
  type: string,
  id: any
): Promise<any> {
  const oldImagePath = path.join(
    __dirname,
    "..",
    "..",
    `/assets/images/images/${imageName}`
  );

  if (!oldImagePath) {
    return;
  }

  const logoPath = path.join(__dirname, "..", "..", "assets/logo/logo.png");
  let logo = await jimp.read(logoPath);
  // logo.resize(130, 45);
  let imageData: any;
  const fileName = Date.now();
  let extension = imageName.split(".")[1];
  let originalImgName = imageName;

  const name = id;
  originalImgName = imageName;
  const imgNamesObj: any = {
    originalImgName,
    productId: name,
  };

  imgNamesObj["imgExtension"] = extension;
  if (extension === "") {
    throw new NumerusError(
      "Unsupported upload file type",
      "NUMERUS_VALIDATION"
    );
  }
  const font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
  if (!fs.existsSync(path.join(__dirname, "..", "..", `/assets/images`))) {
    fs.mkdirSync(path.join(__dirname, "..", "..", `/assets/images`));
  }
  if (
    !fs.existsSync(path.join(__dirname, "..", "..", `/assets/images/${type}`))
  ) {
    fs.mkdirSync(path.join(__dirname, "..", "..", `/assets/images/${type}`));
  }

  const fileDir = path.join(
    __dirname,
    "..",
    "..",
    `/assets/images/${type}/${id}`
  );
  if (fs.existsSync(fileDir)) {
    fs.readdirSync(fileDir).forEach((f) => fs.unlinkSync(`${fileDir}/${f}`));
    fs.rmdirSync(fileDir);
  }

  fs.mkdirSync(fileDir);
  if (originalImgName) {
    const filePath = path.join(fileDir, originalImgName);
    imgNamesObj.original = originalImgName;
    fs.copyFileSync(oldImagePath, filePath);
  }

  const filePath = path.join(fileDir, `original_${name}.${extension}`);
  const productLogoPath = path.join(
    fileDir,
    `original_product_${name}.${extension}`
  );

  imgNamesObj.original = `original_${name}.${extension}`;
  imgNamesObj.originalLogo = `original_article_${name}.${extension}`;
  fs.copyFileSync(oldImagePath, filePath);

  const image = await jimp.read(oldImagePath);
  image.getBase64(jimp.AUTO, (err: any, base64Image: any) => {
    imageData = base64Image;
  });

  await image.print(
    font,
    image.bitmap.width - 150,
    image.bitmap.height - 25,
    {
      text: "youandworld.am",
      alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
    },
    150,
    25
  );

  if (image.bitmap.width < 500 || image.bitmap.height < 500) {
    const logo = await jimp.read(logoPath);
    logo.resize(90, 90);
    image.composite(logo, image.bitmap.width - 100, image.bitmap.height - 100, {
      mode: jimp.BLEND_SOURCE_OVER,
      opacityDest: 1,
      opacitySource: 1,
    });
    await image.print(
      font,
      image.bitmap.width - 150,
      image.bitmap.height - 25,
      {
        text: "youandworld.am",
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
      },
      150,
      25
    );
    image.write(productLogoPath);
  } else {
    image.composite(logo, image.bitmap.width - 180, image.bitmap.height - 180, {
      mode: jimp.BLEND_SOURCE_OVER,
      opacityDest: 1,
      opacitySource: 0.9,
    });
    await image.print(
      font,
      image.bitmap.width - 150,
      image.bitmap.height - 25,
      {
        text: "youandworld.am",
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
      },
      150,
      25
    );
    image.write(productLogoPath);
  }

  if (extension === "jpg" && Env.upload.convertJpgToPng) {
    const logoPathPng = path.join(fileDir, `original_product_${name}.png`);
    imgNamesObj.originalPng = `original_${name}.png`;
    const image = await jimp.read(oldImagePath);
    if (image.bitmap.width < 500 || image.bitmap.height < 500) {
      const logo = await jimp.read(logoPath);
      logo.resize(90, 90);
      image.composite(
        logo,
        image.bitmap.width - 100,
        image.bitmap.height - 100,
        {
          mode: jimp.BLEND_SOURCE_OVER,
          opacityDest: 1,
          opacitySource: 0.9,
        }
      );
      await image.print(
        font,
        image.bitmap.width - 150,
        image.bitmap.height - 25,
        {
          text: "youandworld.am",
          alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
        },
        150,
        25
      );
    } else {
      image.composite(
        logo,
        image.bitmap.width - 180,
        image.bitmap.height - 180,
        {
          mode: jimp.BLEND_SOURCE_OVER,
          opacityDest: 1,
          opacitySource: 0.9,
        }
      );
      await image.print(
        font,
        image.bitmap.width - 150,
        image.bitmap.height - 25,
        {
          text: "youandworld.am",
          alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
        },
        150,
        25
      );
    }
    image.write(logoPathPng);
  }

  let processedCount = 0;
  for (const dim of Env.upload.sizes) {
    const fileDirDim = path.join(
      __dirname,
      "..",
      "..",
      `/assets/images/${type}/${name}`
    );
    const img = await jimp.read(oldImagePath);

    const oWidth = img.bitmap.width;
    const oHeight = img.bitmap.height;
    let width = dim.width;
    let height = dim.height;
    if (oWidth > oHeight) {
      const offset = (oWidth - oHeight) / 2;
      img.crop(offset, 0, oHeight, oHeight);
    }

    if (oWidth < oHeight) {
      const offset = (oHeight - oWidth) / 2;
      img.crop(0, offset, oWidth, oWidth);
    }

    img.resize(width, height);
    if (dim.height > 700 && width > 700) {
      img.composite(logo, width - 180, height - 180, {
        mode: jimp.BLEND_SOURCE_OVER,
        opacityDest: 1,
        opacitySource: 0.9,
      });
    } else if (dim.height > 500 && width > 500) {
      img.composite(logo, width - 180, height - 180, {
        mode: jimp.BLEND_SOURCE_OVER,
        opacityDest: 1,
        opacitySource: 0.9,
      });
      await img.print(
        font,
        width - 150,
        height - 25,
        {
          text: "youandworld.am",
          alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
        },
        150,
        25
      );
    } else if (dim.height > 250 && width > 250) {
      const logo = await jimp.read(logoPath);
      logo.resize(90, 90);
      img.composite(logo, width - 100, height - 100, {
        mode: jimp.BLEND_SOURCE_OVER,
        opacityDest: 1,
        opacitySource: 0.9,
      });
      await img.print(
        font,
        width - 150,
        height - 25,
        {
          text: "youandworld.am",
          alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
        },
        150,
        25
      );
    }

    const filePathDim = path.resolve(fileDirDim, `${dim.name}.${extension}`);
    imgNamesObj[`${dim.name}_${fileName}`] = `${dim.name}.${extension}`;
    img.write(filePathDim);
    if (extension === "jpg" && Env.upload.convertJpgToPng) {
      const filePathDim = path.resolve(fileDirDim, `${dim.name}.png`);
      imgNamesObj[`${dim.name}_${fileName}`] = `${dim.name}.png`;
      img.write(filePathDim);
    }
  }
  return { imgObj: imgNamesObj, imageData };
}

export function fileUpload(): any {
  try {
    return async (req: any, res: any, next: NextFunction) => {
      try {
        const form = new formidable.IncomingForm();
        const fileName = Date.now();
        let extension = "";
        let fileType = "";
        let originalName = "";
        let type: string = "contact";

        form.parse(req, async (err: any, fields: any, files: any) => {
          const file = files["file"];
          const name = fields["name"];
          type = fields["type"];
          originalName = file.originalFilename;
          const fileNamesObj: any = {
            originalName,
            modelName: name,
          };
          try {
            switch (file.mimetype) {
              case "application/pdf":
                extension = "pdf";
                fileType = "document";
                break;
              case "application/jpeg":
                extension = "jpg";
                fileType = "image";
                break;
              case "image/jpeg":
                extension = "jpg";
                fileType = "image";
                break;
              case "image/png":
                extension = "png";
                fileType = "image";
                break;
              case "text/plain":
                extension = "txt";
                fileType = "document";
                break;
              default:
                extension = "";
                break;
            }
            fileNamesObj["fileExtension"] = extension;
            fileNamesObj["fileType"] = fileType;
            if (extension === "") {
              throw new NumerusError(
                "Unsupported upload file type",
                "NUMERUS_VALIDATION"
              );
            }
            if (
              !fs.existsSync(path.join(__dirname, "..", "..", `/assets/files`))
            ) {
              fs.mkdirSync(path.join(__dirname, "..", "..", `/assets/files`));
            }
            if (
              !fs.existsSync(
                path.join(__dirname, "..", "..", `/assets/files/${type}`)
              )
            ) {
              fs.mkdirSync(
                path.join(__dirname, "..", "..", `/assets/files/${type}`)
              );
            }

            const fileDir = path.join(
              __dirname,
              "..",
              "..",
              `/assets/files/${type}/${name}`
            );
            if (fs.existsSync(fileDir)) {
              fs.readdirSync(fileDir).forEach((f) =>
                fs.unlinkSync(`${fileDir}/${f}`)
              );
              fs.rmdirSync(fileDir);
            }

            fs.mkdirSync(fileDir);

            const filePath = path.join(fileDir, originalName);
            fileNamesObj.original = originalName;
            fs.copyFileSync(file.filepath, filePath);

            req.file = {};
            req.file.fileObj = fileNamesObj;
            req.file.type = type;
            next();
          } catch (e) {
            console.log(1389, e);
            responseSender(
              new NumerusError(
                "Unsupported upload file type",
                "NUMERUS_VALIDATION",
                null,
                { error: e }
              ),
              res
            );
          }
        });
        /*,(err, fields, files) => {

                    }*/
      } catch (e) {
        console.log(e);
        responseSender(
          new NumerusError(
            "Unsupported upload file type",
            "NUMERUS_VALIDATION"
          ),
          res
        );
      }
    };
  } catch (e) {
    console.log(e);
  }
}
