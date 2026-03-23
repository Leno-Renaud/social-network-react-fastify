import { getConversations, getMessage, createMessage, deleteMessage, joinEvent } from "../services/message.service.js";

export async function handleGetConversations(req, reply) {
  const conversations = await getConversations(req.server.pg, req.user.username);
  reply.send(conversations);
}
export async function handleCreateMessage(req, reply) {
  try {
      await createMessage(req.server.pg, req.user.username, req.body);
      reply.code(201).send({"message": "sucess"});
  } 
  catch (error) {
      reply.code(401).send({"message": error.message});
  }
}
export async function handleGetMessage(req, reply) {
  const messages = await getMessage(req.server.pg, req.user.username, req.params.eventId);
  reply.send(messages);
}

export async function handleDeleteMessage(req, reply) {
    const message = await deleteMessage(req.server.pg, req.params.id);
    reply.code(202).send({"message": "success", "data": message});
}

export async function handleJoinEvent(req, reply) {
    const { eventId } = req.body;
    const { username } = req.user;
    try {
        await joinEvent(req.server.pg, eventId, username);
        reply.send({ message: "Joined event successfully" });
    } catch (err) {
        reply.code(500).send({ message: err.message });
    }
}