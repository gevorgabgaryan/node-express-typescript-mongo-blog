const {Translate} = require('@google-cloud/translate').v2;
import Env from "../../env";

// Instantiates a client
const translate = new Translate({key: Env.googleAPIKey });
export async function googleTranslate(
    text: any,
    target: any,
    lang: string
  ): Promise<any> {
    const [translation] = await translate.translate(text, target);
    return translation
  }
  
