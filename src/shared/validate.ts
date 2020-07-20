import joi from 'joi';
import {Request, Response, NextFunction} from 'express';
import {responseSender} from '../helper/helper';
import logger from './logger';
import {NumerusError} from './errors';
import Telegram from '../telegram/telegram';
import Env from '../../env';



const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[-!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/0-9a-zA-Z]{6,}$/;

export function validateLoginInfo(req: Request, res: Response, next: NextFunction): any {
    const bodySchema = joi.object({
        email: joi.string().min(3).max(100).email().required(),
        password: joi.string().min(3).max(100).required()
    })
    validateHandler(req, res, next, bodySchema);
}



export function validateRegisterInfo(req: Request, res: Response, next: NextFunction): any {
    const bodySchema = joi.object({
        firstName: joi.string().min(3).max(200),
        lastName: joi.string().min(3).max(200),
        email: joi.string().min(3).max(100).email().required(),
        password: joi.string().regex(RegExp(passwordPattern)).required().min(8).max(20)
    })
    validateHandler(req, res, next, bodySchema)

}

export function getAllUserValidator(req: Request, res: Response, next: NextFunction): any {
    const querySchema = joi.object({
        page: joi.string().required(),
        itemsPerPage: joi.string().required(),
        role: joi.string().valid('any', ...Env.roles),
        status: joi.string().valid('any', ...Env.statuses),
        keyword: joi.string()
    });
    validateHandler(req, res, next, null, querySchema)
}

export function editUserValidator(req: Request, res: Response, next: NextFunction): any {
    const paramsSchema = joi.object({
        id: joi.string().required()
    });
    validateHandler(req, res, next, null, null, paramsSchema)
}


//articles
export function getArticleValidator(req: Request, res: Response, next: NextFunction): any {
    const querySchema = joi.object({
        lang: joi.string().required(),
    });
    const paramsSchema = joi.object({
        articleId: joi.string().required(),
    });
    validateHandler(req, res, next, null, querySchema, paramsSchema)
}

export function getAllArticlesForAdminValidator(req: Request, res: Response, next: NextFunction): any {
    const querySchema = joi.object({
        page: joi.string().required(),
        itemsPerPage: joi.string().required(),
        keyword: joi.string()
    });
    validateHandler(req, res, next, null, querySchema)
}

export function getAllArticlesValidator(req: Request, res: Response, next: NextFunction): any {
    const querySchema = joi.object({
        page: joi.string().required(),
        itemsPerPage: joi.string().required(),
        lang: joi.string().valid(...Env.languages),
        category: joi.string(),
        keyword: joi.string(),
        articleId: joi.string(),
        seenArticleIds: joi.string(),
    });
    validateHandler(req, res, next, null, querySchema)
}

export function editArticleValidator(req: Request, res: Response, next: NextFunction): any {
    const paramsSchema = joi.object({
        id: joi.string().required()
    });
    validateHandler(req, res, next, null, null, paramsSchema)
}

export function addArticleValidator(req: Request, res: Response, next: NextFunction): any {
    const bodySchema = joi.object({
        title: joi.object().keys({
            en: joi.string(),
            ru: joi.string(),
            hy: joi.string(),
        }).required(),
        desc: joi.object().keys({
            en: joi.string(),
            ru: joi.string(),
            hy: joi.string(),
        }),
        text: joi.object().keys({
            en: joi.string(),
            ru: joi.string(),
            hy: joi.string(),
        }),
        keywords: joi.object().keys({
            en: joi.string(),
            ru: joi.string(),
            hy: joi.string(),
        }),
        alias: joi.object().keys({
            en: joi.string(),
            ru: joi.string(),
            hy: joi.string(),
        }).required(),
        category: joi.object(),
        author: joi.object(),
        visible: joi.boolean()
    });
    validateHandler(req, res, next, null, null, bodySchema)
}

//poems

export function getPoemValidator(req: Request, res: Response, next: NextFunction): any {
    const querySchema = joi.object({
        lang: joi.string().required(),
    });
    const paramsSchema = joi.object({
        poemId: joi.string().required(),
    });
    validateHandler(req, res, next, null, querySchema, paramsSchema)
}

export function getAllPoemsForAdminValidator(req: Request, res: Response, next: NextFunction): any {
    const querySchema = joi.object({
        page: joi.string().required(),
        itemsPerPage: joi.string().required(),
        keyword: joi.string()
    });
    validateHandler(req, res, next, null, querySchema)
}

export function getAllPoemsValidator(req: Request, res: Response, next: NextFunction): any {
    const querySchema = joi.object({
        page: joi.string().required(),
        itemsPerPage: joi.string().required(),
        lang: joi.string().valid(...Env.languages),
        keyword: joi.string(),
        poemId: joi.string(),
        seenPoemIds: joi.string(),
    });
    validateHandler(req, res, next, null, querySchema)
}

export function editPoemValidator(req: Request, res: Response, next: NextFunction): any {
    const paramsSchema = joi.object({
        id: joi.string().required()
    });
    validateHandler(req, res, next, null, null, paramsSchema)
}

export function addPoemValidator(req: Request, res: Response, next: NextFunction): any {
    const bodySchema = joi.object({
        title: joi.object().keys({
            en: joi.string(),
            ru: joi.string(),
            hy: joi.string(),
        }).required(),
        desc: joi.object().keys({
            en: joi.string(),
            ru: joi.string(),
            hy: joi.string(),
        }),
        text: joi.object().keys({
            en: joi.string(),
            ru: joi.string(),
            hy: joi.string(),
        }),
        keywords: joi.object().keys({
            en: joi.string(),
            ru: joi.string(),
            hy: joi.string(),
        }),
        alias: joi.object().keys({
            en: joi.string(),
            ru: joi.string(),
            hy: joi.string(),
        }).required(),
        category: joi.object(),
        author: joi.object(),
        visible: joi.boolean()
    });
    validateHandler(req, res, next, null, null, bodySchema)
}

export function removePoemValidator(req: Request, res: Response, next: NextFunction): any {
    const bodySchema = joi.object({
        id: joi.string().required(),
    });
    validateHandler(req, res, next, null, null, bodySchema)
}


//aphorism

export function getAphorismValidator(req: Request, res: Response, next: NextFunction): any {
    const querySchema = joi.object({
        lang: joi.string().required(),
    });
    const paramsSchema = joi.object({
        aphorismId: joi.string().required(),
    });
    validateHandler(req, res, next, null, querySchema, paramsSchema)
}

export function getAllAphorismsForAdminValidator(req: Request, res: Response, next: NextFunction): any {
    const querySchema = joi.object({
        page: joi.string().required(),
        itemsPerPage: joi.string().required(),
        keyword: joi.string()
    });
    validateHandler(req, res, next, null, querySchema)
}

export function getAllAphorismsValidator(req: Request, res: Response, next: NextFunction): any {
    const querySchema = joi.object({
        page: joi.string().required(),
        itemsPerPage: joi.string().required(),
        lang: joi.string().valid(...Env.languages),
        category: joi.array(),
        keyword: joi.string()
    });
    validateHandler(req, res, next, null, querySchema)
}

export function editAphorismValidator(req: Request, res: Response, next: NextFunction): any {
    const paramsSchema = joi.object({
        id: joi.string().required()
    });
    validateHandler(req, res, next, null, null, paramsSchema)
}

export function addAphorismValidator(req: Request, res: Response, next: NextFunction): any {
    const bodySchema = joi.object({
        text: joi.object().keys({
            en: joi.string(),
            ru: joi.string(),
            hy: joi.string().required(),
        }),
        author: joi.object().keys({
            en: joi.string(),
            ru: joi.string(),
            hy: joi.string(),
        }),
        visible: joi.boolean(),
        aphorismFontSize: joi.number(),
        aphorismWith: joi.number(),
        aphorismHeight: joi.number(),
    });
    validateHandler(req, res, next, null, null, bodySchema)
}

export function removeAphorismValidator(req: Request, res: Response, next: NextFunction): any {
    const bodySchema = joi.object({
        id: joi.string().required(),
    });
    validateHandler(req, res, next, null, null, bodySchema)
}


//gallery

export function getGalleryValidator(req: Request, res: Response, next: NextFunction): any {
    const querySchema = joi.object({
        lang: joi.string().required(),
    });
    const paramsSchema = joi.object({
        galleryId: joi.string().required(),
    });
    validateHandler(req, res, next, null, querySchema, paramsSchema)
}

export function getAllGalleriesForAdminValidator(req: Request, res: Response, next: NextFunction): any {
    const querySchema = joi.object({
        page: joi.string().required(),
        itemsPerPage: joi.string().required(),
        keyword: joi.string()
    });
    validateHandler(req, res, next, null, querySchema)
}

export function getAllGalleriesValidator(req: Request, res: Response, next: NextFunction): any {
    const querySchema = joi.object({
        page: joi.string().required(),
        itemsPerPage: joi.string().required(),
        lang: joi.string().valid(...Env.languages),
        category: joi.array(),
        keyword: joi.string()
    });
    validateHandler(req, res, next, null, querySchema)
}

export function editGalleryValidator(req: Request, res: Response, next: NextFunction): any {
    const paramsSchema = joi.object({
        id: joi.string().required()
    });
    validateHandler(req, res, next, null, null, paramsSchema)
}

export function addGalleryValidator(req: Request, res: Response, next: NextFunction): any {
    const bodySchema = joi.object({
        title: joi.object().keys({
            en: joi.string(),
            ru: joi.string(),
            hy: joi.string(),
        }),
        desc: joi.object().keys({
            en: joi.string(),
            ru: joi.string(),
            hy: joi.string(),
        }),
        text: joi.object().keys({
            en: joi.string(),
            ru: joi.string(),
            hy: joi.string(),
        }),
        keywords: joi.object().keys({
            en: joi.string(),
            ru: joi.string(),
            hy: joi.string(),
        }),
        alias: joi.object().keys({
            en: joi.string(),
            ru: joi.string(),
            hy: joi.string(),
        }).required(),
        category: joi.object(),
        author: joi.object(),
        visible: joi.boolean()
    });
    validateHandler(req, res, next, null, null, bodySchema)
}

export function removeGalleryValidator(req: Request, res: Response, next: NextFunction): any {
    const bodySchema = joi.object({
        id: joi.string().required(),
    });
    validateHandler(req, res, next, null, null, bodySchema)
}





export function removeArticleValidator(req: Request, res: Response, next: NextFunction): any {
    const bodySchema = joi.object({
        id: joi.string().required(),
    });
    validateHandler(req, res, next, null, null, bodySchema)
}

function validateHandler(req: Request, res: Response, next: NextFunction,
    bodySchema?: any,
    querySchema?: any,
    paramsSchema?: any,
): any {
    try {
        const options = {
            abortEarly: false, // include all errors
            allowUnknown: false, // ignore unknown props
            stripUnknown: false // remove unknown props
        };
        if (req.body && Object.keys(req.body).length && bodySchema) {
            const {error} = bodySchema.validate(req.body, options)
            if (error) {
                Telegram.notify('error', 'Numerus validation error', error.details.map(x => x.message).join(', '));
                throw new NumerusError(`Numerus validation error: ${error.details.map(x => x.message).join(', ')}`, 'NUMERUS_VALIDATION_ERROR', null, error.details)
            }
        }
        if (req.query && Object.keys(req.query).length && querySchema) {
            const {error} = querySchema.validate(req.query, options)
            if (error) {
                Telegram.notify('error', 'Numerus validation error', error.details.map(x => x.message).join(', '));
                throw new NumerusError(`Numerus validation error: ${error.details.map(x => x.message).join(', ')}`, 'NUMERUS_VALIDATION_ERROR', null, error.details)
            }
        }
        if (req.params && Object.keys(req.params).length && paramsSchema) {
            const {error} = paramsSchema.validate(req.params, options)
            if (error) {
                Telegram.notify('error', 'Numerus validation error', error.details.map(x => x.message).join(', '));
                throw new NumerusError(`Numerus validation error: ${error.details.map(x => x.message).join(', ')}`, 'NUMERUS_VALIDATION_ERROR', null, error.details)
            }
        }

        // if (error) return responseSender(res,{error: true, errorMessage: `Numerus validation error: ${error.details.map(x => x.message).join(', ')}`});
        next()
    } catch (error) {
        logger.error(error);
        if (error) return responseSender(error, res);
    }
}

export function getContactValidator(req: Request, res: Response, next: NextFunction): any {
    const querySchema = joi.object({
        lang: joi.string().required(),
    });
    const paramsSchema = joi.object({
        articleId: joi.string().required(),
    });
    validateHandler(req, res, next, null, querySchema, paramsSchema)
}

export function getAllContactsForAdminValidator(req: Request, res: Response, next: NextFunction): any {
    const querySchema = joi.object({
        page: joi.string().required(),
        itemsPerPage: joi.string().required(),
        status: joi.string(),
        startDate: joi.string(),
        endDate: joi.string(),
        keyword: joi.string()
    });
    validateHandler(req, res, next, null, querySchema)
}

export function getAllContactsValidator(req: Request, res: Response, next: NextFunction): any {
    const querySchema = joi.object({
        page: joi.string().required(),
        itemsPerPage: joi.string().required(),
        lang: joi.string().valid(...Env.languages),
        category: joi.string(),
        keyword: joi.string(),
        articleId: joi.string(),
        seenArticleIds: joi.string(),
    });
    validateHandler(req, res, next, null, querySchema)
}

export function editContactValidator(req: Request, res: Response, next: NextFunction): any {
    const paramsSchema = joi.object({
        id: joi.string().required()
    });
    validateHandler(req, res, next, null, null, paramsSchema)
}

export function addContactValidator(req: Request, res: Response, next: NextFunction): any {
    const bodySchema = joi.object({
        subject: joi.string().min(3).max(100).required(),
        detail: joi.string().min(3).max(500),
        name: joi.string().min(3).max(100).required(),
        email: joi.string().min(3).max(100).email().required(),
        phone: joi.string().min(3).max(20).required(),

    });
    validateHandler(req, res, next, bodySchema, null, null, )
}

export function removeContactValidator(req: Request, res: Response, next: NextFunction): any {
    const bodySchema = joi.object({
        id: joi.string().required(),
    });
    validateHandler(req, res, next, null, null, bodySchema)
}



