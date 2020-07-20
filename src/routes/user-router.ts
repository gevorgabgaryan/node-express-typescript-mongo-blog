
import { Request, Response, Router } from 'express';
import UserController from '../controllers/user-controller';
import { editUserValidator, getAllUserValidator } from '../shared/validate';
import {responseSender} from '../helper/helper';
import {checkAuthorization} from '../shared/token-authorization';




// Constants
const router = Router();

router.get('/all', getAllUserValidator, checkAuthorization(['admin']), async (req: Request, res: Response) => {
    try {
       const result = await UserController.all(req.query.page, req.query.itemsPerPage, req.query.role,
        req.query.status, req.query.keyword);
       responseSender(null, res, result);
    } catch (err) {
       responseSender(err, res);
    }
 });

 router.put('/edit/:id', editUserValidator, checkAuthorization(['admin']), async (req: Request, res: Response) => {
    try {
       const result = await UserController.edit(req.params.id, req.body);
       responseSender(null, res, result);
    } catch (err) {
       responseSender(err, res);
    }
 });


export default router;
