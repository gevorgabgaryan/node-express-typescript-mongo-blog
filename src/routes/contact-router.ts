
import { Request, Response, Router } from 'express';
import ContactController from '../controllers/contact-controller';
import { addContactValidator, editContactValidator, getAllContactsForAdminValidator, getAllContactsValidator, getContactValidator, removeContactValidator } from '../shared/validate';
import {responseSender} from '../helper/helper';
import {checkAuthorization} from '../shared/token-authorization';




// Constants
const router = Router();

router.get('/all', getAllContactsForAdminValidator, checkAuthorization(['admin']), async (req: Request, res: Response) => {
   try {
      const result = await ContactController.all(req.query.page, req.query.itemsPerPage,  req.query.keyword);
      responseSender(null, res, result);
   } catch (err) {
      responseSender(err, res);
   }
});

router.get('/get-contacts', getAllContactsValidator,  async (req: Request, res: Response) => {
    try {
       const result = await ContactController.getContacts(req.query.page, req.query.itemsPerPage, req.query.lang,);
       responseSender(null, res, result);
    } catch (err) {
       responseSender(err, res);
    }
 });


 router.get('/get/:path', getContactValidator,  async (req: Request, res: Response) => {
   try {
      const result = await ContactController.getContact(req.params.contactId, req.query.lang);
      responseSender(null, res, result);
   } catch (err) {
      responseSender(err, res);
   }
});
 router.post('/add', addContactValidator, async (req: Request, res: Response) => {
   try {
      const result = await ContactController.add(req.body);
      responseSender(null, res, result);
   } catch (err) {
      responseSender(err, res);
   }
});

 router.put('/edit/:id', editContactValidator, checkAuthorization(['admin']), async (req: Request, res: Response) => {
    try {
       const result = await ContactController.edit(req.params.id, req.body);
       responseSender(null, res, result);
    } catch (err) {
       responseSender(err, res);
    }
 });
 router.delete('/remove', removeContactValidator, checkAuthorization(['admin']), async (req: Request, res: Response) => {
   try {
      const result = await ContactController.remove(req.body);
      responseSender(null, res, result);
   } catch (err) {
      responseSender(err, res);
   }
});


export default router;
