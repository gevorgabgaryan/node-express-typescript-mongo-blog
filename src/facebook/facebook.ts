import logger from "../shared/logger";
import { FB, FacebookApiException } from "fb";
import Env from "../../env";
import fs from "fs";
import path from "path";
import { Setting } from "../models/settings-model";

class Facebook {
  static async  getYouandworldAccessToken(link: string, message: string) {
    FB.api("/oauth/access_token", "get", {
      grant_type: "fb_exchange_token",
      client_id: Env.youandworldId,
      client_secret: Env.youandwoldSec,
      fb_exchange_token: "HORT-LIVED-USER-ACCESS-TOKEN"

    }, async function (res: any) {
      if (!res || res.error) {
        console.log(!res ? "token" : res.error);
        return;
      }
     const result =res;
     await Setting.set(
      "youadworldToken",
      res.access_token
    );
     Facebook.postYouandworld(link, message)
    });
  }

  static async postYourorinak(link: string, message: string) {
    const yurIdToken = await Setting.get(
      "yurIdToken",
      Env.yurIdToken
    );
    FB.setAccessToken(yurIdToken);
    const body = "My first post using facebook-node-sdk";
    const res = await FB.api("me/feed", "post", { link, message });
    if (!res || res.error) {
      if (res.error.code === 190) {
         await Facebook.getYouandworldAccessToken(link, message);
      }
      console.log(!res ? "error occurred" : res.error);
      return;
    }
    console.log("Post Id: " + res.id);
    return res.id;
  }

  static async postMiniYou(link: string, message: string) {
    const miniYouIdToken = await Setting.get(
      "miniYouIdToken",
      Env.miniYouIdToken
    );
    FB.setAccessToken(miniYouIdToken);
    const body = "My first post using facebook-node-sdk";
    const res = await FB.api("me/feed", "post", { link, message });
    if (!res || res.error) {
      if (res.error.code === 190) {
         await Facebook.getYouandworldAccessToken(link, message);
      }
      console.log(!res ? "error occurred" : res.error);
      return;
    }
    console.log("Post Id: " + res.id);
    return res.id;
  }
  static async postStyle(link: string, message: string) {
    const styleIdToken = await Setting.get(
      "styleIdToken",
      Env.styleIdToken
    );
    FB.setAccessToken(styleIdToken);
    const body = "My first post using facebook-node-sdk";
    const res = await FB.api("me/feed", "post", { link, message });
    if (!res || res.error) {
      if (res.error.code === 190) {
         await Facebook.getYouandworldAccessToken(link, message);
      }
      console.log(!res ? "error occurred" : res.error);
      return;
    }
    console.log("Post Id: " + res.id);
    return res.id;
  }
  static async postProfileYou(link: string, message: string) {
    const profileYouToken = await Setting.get(
      "profileYouToken",
      Env.profileYouToken
    );
    FB.setAccessToken(profileYouToken);
    const body = "My first post using facebook-node-sdk";
    const res = await FB.api("me/feed", "post", { link, message });
    if (!res || res.error) {
      if (res.error.code === 190) {
         await Facebook.getYouandworldAccessToken(link, message);
      }
      console.log(!res ? "error occurred" : res.error);
      return;
    }
    console.log("Post Id: " + res.id);
    return res.id;
  }
  static async postYouandworld(link: string, message: string) {
    const youadworldToken = await Setting.get(
      "youadworldToken",
      Env.youadworldToken
    );
    FB.setAccessToken(youadworldToken);
    const body = "My first post using facebook-node-sdk";
    const res = await FB.api("me/feed", "post", { link, message });
    if (!res || res.error) {
      if (res.error.code === 190) {
         await Facebook.getYouandworldAccessToken(link, message);
      }
      console.log(!res ? "error occurred" : res.error);
      return;
    }
    console.log("Post Id: " + res.id);
    return res.id;
  }

  static async postYouandworldNew(link: string, message: string) {
    const youadworldToken = await Setting.get(
      "youadworldToken",
      Env.youandworldNewToken
    );
    FB.setAccessToken(youadworldToken);
    const body = "My first post using facebook-node-sdk";
    const res = await FB.api("me/feed", "post", { link, message });
    if (!res || res.error) {
      if (res.error.code === 190) {
         await Facebook.getYouandworldAccessToken(link, message);
      }
      console.log(!res ? "error occurred" : res.error);
      return;
    }
    console.log("Post Id: " + res.id);
    return res.id;
  }

  // static postArtImg() {
  //   const logoPath = path.join(__dirname, "..", "..", "assets/logo/logo.png");
  //   FB.api('me/photos', 'post', {
  //      source: 'https://numerus.youandworld.am/images/articles/1111307/original_product_1111307.png',
  //      caption: 'https://youandworld.am/articles/1111307/hy'
  //      }, function (res) {
  //     if(!res || res.error) {
  //       console.log(!res ? 'error occurred' : res.error);
  //       return;
  //     }
  //     console.log('Post Id: ' + res.post_id);
  //   });

  // }
  static postImg() {
    const logoPath = path.join(__dirname, "..", "..", "assets/logo/logo.png");
    FB.api('me/photos', 'post', {
       source: fs.createReadStream(logoPath),
       caption: 'Youandworld logo'
       }, function (res) {
      if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
      console.log('Post Id: ' + res.post_id);
    });

  }
}

export default Facebook;
