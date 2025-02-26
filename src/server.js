import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';



const PORT = process.env.PORT || 3000;

export function setupServer() {
  const app = express();

  app.use(express.json());

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  // app.get('/', (req, res) => {
  //   res.send('Hello, world!');
  // });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    console.log('contact: ', contact);
    if (!contact) {
      res
        .status(404)
        .json({
          status: 404,
          message: 'Contact not found',
          error: `The requested contact with id ${contactId} was not found`,
        });
      return;
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use((req, res, next) => {
    const url = req.url;
    res.status(404).json({
      status: 404,
      message: `Route ${url} Not found`,
      error: `The requested resource ${req.url} was not found`,
    });
  });

  app.use((error, req, res, next) => {
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      error: error.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
  });
}
