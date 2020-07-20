import { Router } from 'express';
import authRouter from './auth-router';
import userRouter from './user-router';
import articleRouter from './article-router';
import uploadRouter from './upload-router';
import contactRouter from './contact-router';


import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


// Init
const apiRouter = Router();

// Add api routes
apiRouter.use('/auth', limiter, authRouter);
apiRouter.use('/users',  userRouter);
apiRouter.use('/articles',  articleRouter);
apiRouter.use('/upload',  uploadRouter);
apiRouter.use('/contacts',  contactRouter);

// Export default
export default apiRouter;
