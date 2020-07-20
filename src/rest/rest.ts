import morgan from 'morgan';
import path from 'path';
import http from 'http';
import helmet from 'helmet';
import StatusCodes from 'http-status-codes';
import express, {Request, Response} from 'express';
import 'express-async-errors';
import BaseRouter from '../routes/api';
import logger from '../shared/logger';
import {CustomError, NumerusError} from '../shared/errors';
import cors from 'cors';
import Env from '../../env';
import {responseSender} from '../helper/helper';
import UserController from '../controllers/user-controller';
import ArticleController from '../controllers/article-controller';
import AphorismController from '../controllers/aphorism-controller';
import PoemController from '../controllers/poem-controller';
import GalleryController from '../controllers/gallery-controller';




class Rest {

    static async init() {
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));
        app.use(cors());
        app.use(morgan('tiny', {
            stream: {
                write: (message: string) => {
                    logger.info(message);
                }
            }
        }));


        // Show routes called in console during development
        if (!Env.isProd) {
            app.use(morgan('dev'));
        }
        const staticDir = path.join(__dirname,'..','..', 'assets');   
        app.use(express.static(staticDir));

        // Security
        if (Env.isProd) {
            app.use(helmet());
        }
   
        // Add APIs
        app.use('/api', BaseRouter);

        app.use(function (req, res, next) {
       
            responseSender(new NumerusError('API not found in Numerus system', 'NUMERUS_API_NOT_FOUND', 400,
            {
                message: 'API not found',
                method: req.method,
                url: req.originalUrl,
                IP: req.headers['x-forwarded-for'] || req.connection.remoteAddress
            }), res)      
        });

        // Error handling
        app.use((err: Error | CustomError, _: Request, res: Response) => {
            logger.error(err);
            if (!Env.isProd) {
                console.log(err);                
            }
            responseSender(err instanceof NumerusError? err : (err && err.message ? err.message : err), res);           
        });



        /************************************************************************************
         *                              Serve front-end content
         ***********************************************************************************/


       



        // Users page
        app.get('/users', (req: Request, res: Response) => {

        });
        const server = http.createServer(app);
        // Constants
        const serverStartMsg = 'Rest server started on port: ',
            port = Env.listeningPort;

        // Start server
        server.listen(port, () => {
            console.log(serverStartMsg + port);
            logger.info(serverStartMsg + port);
        });

        if (Env.email) {
            UserController.createAdminUser(Env.email, Env.password)
        }
        await  ArticleController.initImages();
        await AphorismController.initImages();
        await PoemController.initImages();
        await GalleryController.initImages();
    }

}





export default Rest;
