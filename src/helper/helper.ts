import {NumerusError} from '../shared/errors';
import logger from '../shared/logger';



export function responseSender(err: any, response: any, result?: any): void {
    let res: any;
    if (err) {
        if (err instanceof NumerusError) {
            res = {
              error: true,
              message: err.errMsg,
              key: err.errKey,
              code: err.errCode,
              info: err.errInfo
            }
            logger.error(err.errMsg);
        } else if (err instanceof Error) {
            res = {
                error: true,
                message: JSON.stringify(err),
                key: 'NUMERUS_SYSTEM_ERROR'
            };
            logger.error(err.toString());            
            logger.error(err.name);
            logger.error(err.stack);

        } else if (typeof err === 'string') {
            res =  {
                error: true,
                message: err,
                key: 'NUMERUS_SYSTEM_ERROR'
            };
            logger.error(err);
        } else {
            res = {
                error: true,
                message:'UNEXPECTED ERROR',
                key: 'NUMERUS_SYSTEM_ERROR'
            };;
            logger.error(err);
        }
    } else {
        if (!result) {
            res = {'numerus': true};  
        } else {
            res = result;
        }
        
    }
    response.json(res);    
}
