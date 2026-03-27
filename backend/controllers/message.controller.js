import * as MessageService from "../services/message.service.js";
import { emitMessageCreated } from "../socket/message.socket.js";

export async function handleGetConversations(req, reply) {
  const conversations = await MessageService.getConversations(req.server.pg, req.user.username);
  reply.send(conversations);
}
export async function handleCreateMessage(req, reply) {
  try {
      const createdMessage = await MessageService.createMessage(req.server.pg, req.user.username, req.body);
      await emitMessageCreated(req.server, createdMessage);
      reply.code(201).send({"message": "success", "data": createdMessage});
  } 
  catch (error) {
      reply.code(401).send({"message": error.message});
  }
}
export async function handleGetMessage(req, reply) {
  const messages = await MessageService.getMessage(req.server.pg, req.user.username, req.params.eventId);
  reply.send(messages);
}

export async function handleDeleteMessage(req, reply) {
    const message = await MessageService.deleteMessage(req.server.pg, req.params.id);
    reply.code(202).send({"message": "success", "data": message});
}