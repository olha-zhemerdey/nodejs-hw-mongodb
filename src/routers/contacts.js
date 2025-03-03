import { Router } from 'express';
import {
  getContactByIdController,
  getContactsController,
  createContactController,
  patchContactController,
  upsertContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();
 
contactsRouter.get('/contacts', ctrlWrapper(getContactsController));
contactsRouter.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
contactsRouter.post('/contacts', ctrlWrapper(createContactController));
contactsRouter.patch('/contacts/:contactId', ctrlWrapper(patchContactController));
contactsRouter.put('/contacts/:contactId', ctrlWrapper(upsertContactController));
contactsRouter.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

export default contactsRouter;