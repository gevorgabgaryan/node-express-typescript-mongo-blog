import {IgApiClient} from "instagram-private-api";

import {readFile} from "fs";
import {promisify} from "util";
import Env from "../../env";
import fs from "fs";
import path from "path";
import {Setting} from "../models/settings-model";

const readFileAsync = promisify(readFile)

const ig = new IgApiClient();

async function login() {
  ig.state.generateDevice(Env.instagramUser);
  await ig.account.login(Env.instagramUser, Env.instagramSoc);
}

class Instagram {

    static async login() {
        await login();
      }
  static async postPhoto(pathName: string, message: string, isStory: boolean){


    const publishResult = await ig.publish.photo({
      file: await readFileAsync(path.join(__dirname, "..", "..", `/assets/${pathName}`)),
      caption: message,
    });

    let  publishStoryResult: any;
    if (isStory) {
          publishStoryResult = await ig.publish.story({
            file: await readFileAsync(path.join(__dirname, "..", "..", `/assets/${pathName}`)),
          });

    }


    if (publishResult && publishResult.upload_id) {
        if (publishStoryResult && publishStoryResult.upload_id ) {
            return   `${publishResult.upload_id}/${publishStoryResult.upload_id}`;
        }
       return   publishResult.upload_id
    }
    return `${Date.now()}`
  }
}

export default Instagram;