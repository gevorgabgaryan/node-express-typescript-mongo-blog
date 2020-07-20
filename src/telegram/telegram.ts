import logger from '../shared/logger';
import TelegramBot from 'node-telegram-bot-api';
import Env from '../../env';
process.env.NTBA_FIX_319 = '1';
let isTelegramAvtive: boolean = false;

 const  bot = new TelegramBot(Env.telegram.botId, {polling: false});

class Telegram {
   
    static init() {    
        isTelegramAvtive = true;
        Telegram.notify('info','Numerus system start');
        // Matches "/echo [whatever]"
        bot.onText(/\/echo (.+)/, (msg, match: any) => {
            // 'msg' is the received Message from Telegram
            // 'match' is the result of executing the regexp above on the text content
            // of the message

            const chatId = msg.chat.id;
            const resp = match[1]; // the captured "whatever"

            // send back the matched "whatever" to the chat
            bot.sendMessage(chatId, resp);
        });

        // Listen for any kind of message. There are different kinds of
        // messages.
        bot.on('message', function (msg)  {
                     logger.info(msg)
        });
        
    }
    static notify(type: string, title: string, desc?: string, data?: any ) {
        // if (!isTelegramAvtive) {
        //     return
        // }
        let content = ""
        if (title) {
            
            switch (type) {
                case 'info':
                    content += `<b>${title}</b>\n`
                    break;            
                default:
                    break;
            }
    
        }
        if (desc) {
            content += `<i>${desc}</i>\n`
        }
       
        if (typeof data ===  'object') {
            content += Telegram.objectToMessage(data)
        }

        bot.sendMessage(Env.telegram.chatId, content, {parse_mode: 'HTML'});
    }

    static objectToMessage(obj: any) {
        let html = '';
        
        if (obj === null || obj === undefined) {
            return '';
        }

        const keys = Object.keys(obj);
        for (let k of keys) {
            if (typeof obj[k] !== 'object') {
                if(obj[k] !== 'undefined' || obj[k] !== undefined) {
                    html+=  '<i>' + k + '</i>:  ' +  (obj[k]).toString().replace('>', '').replace('<', '') + '\n';
                } else {
                    html +=   '<i> undefined </i>:\n';
                }
            } else {
                html += + '<i>' + k + '</i>:  \n';
                html += Telegram.objectToMessage(obj[k]);
            }
        }
        return html;
    }
}

export default Telegram