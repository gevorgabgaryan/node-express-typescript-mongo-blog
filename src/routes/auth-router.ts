
import AuthController from '../controllers/auth-controller';
import {validateLoginInfo, validateRegisterInfo} from '../shared/validate';
import {Request, Response, Router} from 'express';
import {responseSender} from '../helper/helper';




// Constants
const router = Router();
router.post('/login', validateLoginInfo, async (req: Request, res: Response) => {
   try {
      const result = await AuthController.login(req.body.email, req.body.password);
      responseSender(null, res, result);
   } catch (err) {
      responseSender(err, res);
   }
});

router.post('/register', validateRegisterInfo, async (req: Request, res: Response) => {
   try {
      const result = await AuthController.register(req.body.email, req.body.password, req.body.firstName, req.body.lastName);
      responseSender(null, res, result);
   } catch (err) {
      responseSender(err, res);
   }


});

export default router;
