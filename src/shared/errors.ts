import HttpStatusCodes from 'http-status-codes';
import Telegram from '../telegram/telegram';




export class NumerusError  {
    errMsg: string;
    errKey: string;
    errInfo: any;
    errCode: any;
    constructor(msg: string, key: string,code? : any, info?: any, ) {
        this.errMsg = msg;
        this.errKey = key,
        this.errInfo = info,
        this.errCode = code
        
        Telegram.notify('Nmerus error', msg, key, info);
    }

}


export abstract class CustomError extends Error {

    public readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

    constructor(msg: string, httpStatus: number) {
        super(msg);
        this.HttpStatus = httpStatus;
    }
}


export class ParamMissingError extends CustomError {

    public static readonly Msg = 'One or more of the required parameters was missing.';
    public static readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

    constructor() {
        super(ParamMissingError.Msg, ParamMissingError.HttpStatus);
    }
}


export class UserNotFoundError extends CustomError {

    public static readonly Msg = 'A user with the given id does not exists in the database.';
    public static readonly HttpStatus = HttpStatusCodes.NOT_FOUND;

    constructor() {
        super(UserNotFoundError.Msg, UserNotFoundError.HttpStatus);
    }
}


export class UnauthorizedError extends CustomError {

    public static readonly Msg = 'Login failed';
    public static readonly HttpStatus = HttpStatusCodes.UNAUTHORIZED;

    constructor() {
        super(UnauthorizedError.Msg, UnauthorizedError.HttpStatus);
    }
}

export class RoomNotFoundError extends CustomError {

    public static readonly Msg = 'socket room not found on socket server.';
    public static readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

    constructor() {
        super(RoomNotFoundError.Msg, RoomNotFoundError.HttpStatus);
    }
}