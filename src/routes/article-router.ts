
import { Request, Response, Router } from 'express';
import ArticleController from '../controllers/article-controller';
import { addArticleValidator, editArticleValidator, getAllArticlesForAdminValidator, getAllArticlesValidator, getArticleValidator, removeArticleValidator } from '../shared/validate';
import {responseSender} from '../helper/helper';
import {checkAuthorization} from '../shared/token-authorization';




// Constants
const router = Router();

router.get('/all', getAllArticlesForAdminValidator, checkAuthorization(['admin']), async (req: Request, res: Response) => {
   try {
      const result = await ArticleController.all(req.query.page, req.query.itemsPerPage,  req.query.keyword);
      responseSender(null, res, result);
   } catch (err) {
      responseSender(err, res);
   }
});

router.get('/get-articles', getAllArticlesValidator,  async (req: Request, res: Response) => {
    try {
       const result = await ArticleController.getArticles(req.query.page, req.query.itemsPerPage, req.query.lang, req.query.category,  req.query.keyword, req.query.articleId, req.query.seenArticleIds );
       responseSender(null, res, result);
    } catch (err) {
       responseSender(err, res);
    }
 });

 router.get('/get-article-ids', async (req: Request, res: Response) => {
   try {
      const result = await ArticleController.getArticleIds();
      responseSender(null, res, result);
   } catch (err) {
      responseSender(err, res);
   }
});

 router.get('/get/:articleId', getArticleValidator,  async (req: Request, res: Response) => {
   try {
      const result = await ArticleController.getArticle(req.params.articleId, req.query.lang);
      responseSender(null, res, result);
   } catch (err) {
      responseSender(err, res);
   }
});
 router.post('/add', addArticleValidator, checkAuthorization(['admin']), async (req: Request, res: Response) => {
   try {
      const result = await ArticleController.add(req.body);
      responseSender(null, res, result);
   } catch (err) {
      responseSender(err, res);
   }
});

 router.put('/edit/:id', editArticleValidator, checkAuthorization(['admin']), async (req: Request, res: Response) => {
    try {
       const result = await ArticleController.edit(req.params.id, req.body);
       responseSender(null, res, result);
    } catch (err) {
       responseSender(err, res);
    }
 });
 router.delete('/remove', removeArticleValidator, checkAuthorization(['admin']), async (req: Request, res: Response) => {
   try {
      const result = await ArticleController.remove(req.body);
      responseSender(null, res, result);
   } catch (err) {
      responseSender(err, res);
   }
});


export default router;
