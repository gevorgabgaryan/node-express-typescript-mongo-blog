import {RecaptchaEnterpriseServiceClient} from '@google-cloud/recaptcha-enterprise';
import {NumerusError} from '../shared/errors';
import logger from '../shared/logger';
const client = new RecaptchaEnterpriseServiceClient();



class GoogleRecaptchaService {

    static async verifyRecaptchaToken(token: string) {
        try {
            // secret key is for signing not for verifying
            // const ticket = await oAuth2Client.verifyIdToken({
            //     idToken: idToken,
            //     audience: config.system.googleAuth.clientId
            // });

            // const payload = ticket.getPayload();
            // const userData = {
            //     email: payload['email'],
            //     firstName: payload['given_name'],
            //     lastName: payload['family_name'],
            //     id: payload['sub'],
            //     locale: payload['locale']
            // };

            // return userData;
        } catch (e) {
            logger.error(e.message || e);
            throw new NumerusError("Google auth error", 'GOOGLE_RECAPTCHA_ERROR');
        }
    }
}

export default GoogleRecaptchaService ;

async function main(projectNumber) {
    // Create the reCAPTCHA client library.

    
  
    // format the path to the project (it should be prefaced with projects/).
    const formattedParent = client.projectPath(projectNumber);
    // assessment should contain event with RESPONSE_TOKEN and RECAPTCHA_SITE_KEY:
    // "{'event': {'token': 'RESPONSE_TOKEN', 'siteKey': 'RECAPTCHA_SITE_KEY'}}"
    const assessment = {};
  
    const request = {
      parent: formattedParent,
      assessment: assessment,
    };
  
    await client.createAssessment(request);
  }