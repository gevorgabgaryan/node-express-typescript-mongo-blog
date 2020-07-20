import logger from "./shared/logger";
import cluster from "cluster";
import {cpus} from "os";
import WebSocketService from "./realtime/realtime";
import Rest from "./rest/rest";
import Telegram from "./telegram/telegram";
import MongooseService from "./helper/mongoose";
import Env from "./local";
import Facebook from "./facebook/facebook";
import Report from "./rest/report";
import FacebookShare from "./rest/facebook-share";
import InstagramShare from "./rest/instagram-share";
import Instagram from "../src/instagram";

process.on("uncaughtException", function (err) {
  console.error(err);
  console.error(err.stack);
});

process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
});
if (Env.isProd) {
  Telegram.init();
} else {
  Telegram.init();
}

MongooseService.init();
WebSocketService.init();
Rest.init();
Report.report();

if (Env.isProd) {
  FacebookShare.shareGallery(21, 32);
  FacebookShare.shareGallery(3, 7);
  FacebookShare.shareArticle(4, 8);
  FacebookShare.shareAphorism(23, 3);
  FacebookShare.shareAphorism(5, 9);
  FacebookShare.sharePoem(6, 10);
  FacebookShare.shareGallery(9, 13);
  FacebookShare.shareGallery(18, 22);
  FacebookShare.shareArticle(16, 0);
  FacebookShare.shareAphorism(10, 14);
  FacebookShare.shareAphorism(15, 19);
  FacebookShare.sharePoem(18, 0);

  // InstagramShare.shareGallery(22, 1);
  // InstagramShare.shareGallery(3, 10);
  // InstagramShare.shareArticle(4, 11);
  // InstagramShare.shareAphorism(23, 23);
  // InstagramShare.shareAphorism(5, 19);
  // InstagramShare.sharePoem(6, 15);
  // InstagramShare.shareGallery(9, 17);
  // InstagramShare.shareGallery(18, 18);
  // InstagramShare.shareArticle(16, 5);
  // InstagramShare.shareAphorism(10, 17);
  // InstagramShare.shareAphorism(15, 16);
  // InstagramShare.sharePoem(18, 7);

  // Instagram.login();
}

// InstagramShare.login(0,15);

// Facebook.postImg()
// if (cluster.isPrimary === true) {
//     // .isPrimary with node v16.0.0 or above
//     // .isMaster (depreciated) with older version
//     const CPUS: any = cpus()
//     CPUS.forEach(() => cluster.fork());

// } else {
//     console.log(process.pid);
//     logger.info(process.pid);

// }
