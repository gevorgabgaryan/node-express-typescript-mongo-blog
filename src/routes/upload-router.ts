
import { Request, Response, Router } from 'express';
import {responseSender} from '../helper/helper';
import {checkAuthorization} from '../shared/token-authorization';
import {imageResizer, imageTextExtract, fileUpload} from '../shared/upload';
import UploadController from '../controllers/upload-controller';

const router = Router();

router.post('/',  checkAuthorization(['admin']),imageResizer(),  async (req: any, res: Response) => {
    try {
       const result = await UploadController.upload(req.file)
       responseSender(null, res, result);
    } catch (err) {
       responseSender(err, res);
    }
 });

 router.post('/aphorism',  checkAuthorization(['admin']),imageTextExtract(),  async (req: any, res: Response) => {
   try {
      const result = await UploadController.uploadAphorism(req.file)
      responseSender(null, res, result);
   } catch (err) {
      responseSender(err, res);
   }
});

router.post('/file',fileUpload(),  async (req: any, res: Response) => {
   try {
      const result = await UploadController.uploadFile(req.file)
      responseSender(null, res, result);
   } catch (err) {
      responseSender(err, res);
   }
});



export default router;
