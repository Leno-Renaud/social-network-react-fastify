import { handleGetConversations, handleGetMessage, handleCreateMessage, handleDeleteMessage } from "../controllers/message.controller.js";

export default async function messageRoute(fastify) {
  fastify.get("/conversations", { preHandler: [fastify.authenticate] }, handleGetConversations);
  fastify.get("/message/:eventId", { preHandler: [fastify.authenticate] }, handleGetMessage);
  fastify.post("/message", { preHandler: [fastify.authenticate] }, handleCreateMessage);
  fastify.delete("/message/:id", handleDeleteMessage);
}
