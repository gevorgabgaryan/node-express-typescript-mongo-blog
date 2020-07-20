import random from 'random';
import * as jwt from 'jsonwebtoken';
import Env from '../../env';
import {NumerusError} from './errors';


export function  generateToken(): string {
    const rundNumber = Math.floor(Math.random() * 1e12);
    return rundNumber.toString(36) + Date.now().toString() + Date.now().toString(36);
}

export function  generateCode(): number {
    return random.int(1e5,1e6-1)
}

export function  generateArticleId(): string {
    return `article-${random.int(1e6,1e7-1)}`
}

export function  jwtSign(payload: any): string {
    return jwt.sign(payload, Env.verify.secret, { expiresIn: `${Env.verify.expiration}d` });
}
export function  jwtVerify(code:  string): any {
    try { 
        return jwt.verify(code, Env.verify.secret);
    } catch (e) {
        throw new NumerusError('Invalid token', 'NUMERUS_INVALID_TOKEN', null, {error: e});
    }    
}

export function  isString(value: string): boolean{
    if(!(isNotNullOrUndefined(value) && (value || value=== "") && typeof value=== "string")) {
        return false
    }
     return true
}


function isNotNullOrUndefined(value: any) {
    return value !== undefined && value != null;
}
