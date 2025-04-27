import express from 'express';
import { pinoHttp } from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { getContacts, getContactsById } from './services/contacts.js';

dotenv.config();

const PORT = process.env.PORT;

export const createServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(
    pinoHttp({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const contacts = await getContacts();
    res.status(200).send({
      message: 'Contacts fetched successfully',
      status: 200,
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;

    const contact = await getContactsById(contactId);

    if (!contact) {
      return res.status(404).send({
        message: 'Contact not found',
        status: 404,
      });
    }
    res.status(200).send({
      message: 'Contact fetched successfully',
      status: 200,
      data: contact,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};
