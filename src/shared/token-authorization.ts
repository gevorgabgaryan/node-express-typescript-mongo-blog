import {Request, Response, NextFunction} from 'express';
import {responseSender} from '../helper/helper';;
import {NumerusError} from './errors';

import AuthController from '../controllers/auth-controller';





export function checkAuthorization(roles: string[]): any{
    return async (req: any, res: any, next: NextFunction) => {
        try {
            let token: any;
    
            if (req.headers.hasOwnProperty('Authorization')) {
                token = req.headers['Authorization'];
            } else {
                token = req.headers['authorization'];
            }
    
            if (!token || token.length === 0) {
                throw new NumerusError("Missing token", 'NUMERUS_UNAUTHORIZED',);
            }
            token = token.trim();
            const session = await  AuthController.checToken(token, roles);
            req.session =session;
            req.userId = session.userId;;
            next()        
    
        } catch (err) {
            responseSender(err, res)
            console.log(err);
    
        }
      }

   
}

