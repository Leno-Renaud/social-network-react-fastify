import { handleGetConversations, handleGetMessage, handleCreateMessage, handleDeleteMessage, handleJoinEvent } from "../controllers/message.controller.js";

export default async function messageRoute(fastify) {
  fastify.get("/conversations", { preHandler: [fastify.authenticate] }, handleGetConversations);
  fastify.get("/message/:eventId", { preHandler: [fastify.authenticate] }, handleGetMessage);
  fastify.post("/message", { preHandler: [fastify.authenticate] }, handleCreateMessage);
  fastify.delete("/message/:id", handleDeleteMessage);
  fastify.post("/joinEvent", { preHandler: [fastify.authenticate] }, handleJoinEvent);
}
