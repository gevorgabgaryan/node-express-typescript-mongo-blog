import logger from '../shared/logger';
import http from 'http';
import WebSocket from 'ws';
import isValidUTF8 from 'utf-8-validate';
import Env from '../../env';

class WebSocketService {

    private static server: any;
    allClients: [];
    static calls: any = {};
    constructor() {
        this.allClients = [];

    }


 

    static init() {

        this.server = http.createServer((request, response) => {
        });
  
        this.server.on('error', (err: any) => {
            logger.error('Websocket server error', err.message)
            console.log(err);

        });

        this.server.on('close', () => {
            console.log('Websocket server closed for whatever reason');
            logger.error('Websocket server closed ');
        });

        const wss = new WebSocket.Server({server: this.server});

        // Broadcast to all.
        const broadcast = function broadcast(data) {
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        };

        wss.on('connection', (ws: WebSocket, req: any) => {
            const ip = req.socket.remoteAddress || req.headers['x-forwarded-for'].split(',')[0].trim();;
            // logger.info('Connect ip address is ', ip)
            ws.on('message', (message: any) => {
                try {
                    if (!isValidUTF8(message) || !message.toString()) {
                        return
                    }
                    const test = message.toString();

                    const callMessage = JSON.parse(message.toString());
                    if (!callMessage.call || this.calls[callMessage.call]) {
                        return
                    }


                    console.log('received: %s', callMessage.call);
                    ws.send(`Hello, you sent -> ${message}`);
                } catch (err) {
                    ws.send(JSON.stringify({call: "error", extra: {
                        message: err.message
                    }}));
                }
            });

            //send immediatly a feedback to the incoming connection    
            ws.send('Hi there, I am a WebSocket server');
        });

        //start our server
        this.server.listen(Env.wsPort, () => {
            console.log(`Websocket server started on port ${this.server.address().port}`);
            logger.info(`Websocket server started on port ${this.server.address().port}`);
        });
    }
    static registerCall(call: string, extra: any, callback: any) {
        WebSocketService.calls[call] = {
            extra,
            callback
        };
    }
   
    initCalls() {
        WebSocketService.registerCall('price', {name},()=>{
            
        })
    }


}

export default WebSocketService;