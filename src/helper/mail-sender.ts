import Env from "../../env";
import sgMail from '@sendgrid/mail';
import fs from 'fs';
import logger from "../shared/logger";
import {NumerusError} from "../shared/errors";
import path from "path";



sgMail.setApiKey(Env.mail.apiKey);

const cachedMailTemplates = {};

class MailSender {
    constructor() {
    }

    static NO_REPLY = null;

    static async send(user: any, mailFileName: any, params: any, from?: any, attachments?: any) {
        let lang = user.lang || 'en';

         if (!Env.mail.enabled) {
            logger.info('Mailing function is disabled');
            return false;
        }

        const data: any = {
            from: {email: Env.mail.noReplyEmail, name: Env.mail.name},
            to: user.email
        };

        if (from) {
            data.from = from;
        }

        if (attachments && attachments.length) {
            data['attachments'] = attachments;
        }

        let mailHtml: any;
        try {
            const mailHtmlFileUri = path.join(__dirname, '..',`/shared/emails/${lang}/${mailFileName}.html`);             
            mailHtml = fs.readFileSync(mailHtmlFileUri, 'utf8');
            if (!mailHtml ) {
                const mailHtmlFileUri = path.join(__dirname, '..',`shared/emails/en/${mailFileName}.html`);
                mailHtml = fs.readFileSync(mailHtmlFileUri, 'utf8'); 
            }
        } catch (err) {
            logger.error(`Failed to open file: ${err.path}`);
            return null;
        }


        for (const key of Object.keys(params)) {
            mailHtml = mailHtml.replace(new RegExp(`{{${key}}}`, "g"), params[key]);
        }     

        if (mailHtml === null) {
            return false; // Error is already reported
        }
        data['text'] = mailHtml;
        data['html'] = mailHtml;

        let Subjects = require(path.join(__dirname, '..', `shared/emails/${lang}/subjects.json`));
        if (Subjects[mailFileName]) {
            data['subject'] = params.subject ? `${params.subject} ${Subjects[mailFileName]}` : Subjects[mailFileName];
        }
        if (!data['subject']) {
            Subjects = require(path.join(__dirname, '..',`/shared/emails/en/subjects.json`));
            data['subject'] = Subjects[mailFileName];
        }
        if (data['subject'] === undefined) {
            return false;
        }

        try {
            sgMail.send(data, false, (err, result) => {
                if (err) {
                    throw new NumerusError(`Mail was not sent error: ${data.to}` + JSON.stringify(err), 'NUMERUS_SYSTEM_ERROR');
                }
                logger.info(`Mail sent to ${data.to}`);
                return true;
            });
        } catch (e) {
            logger.error(`Unhandled exception from Sendgrid for: ${user.email} - ` + JSON.stringify(e));
            return false;
        }
        return true;
    }




}

export default MailSender;
