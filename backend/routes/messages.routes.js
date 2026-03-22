import { getMessages, sendMessage } from '../controllers/messages.controller.js';

export default async function (server) {
  server.get('/messages/:id', getMessages);
  server.post('/messages', sendMessage);
}