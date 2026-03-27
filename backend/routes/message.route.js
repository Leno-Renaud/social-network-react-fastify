import { handleGetConversations, handleGetMessage, handleCreateMessage, handleDeleteMessage, handleGetConversationMembers } from "../controllers/message.controller.js";

export default async function messageRoute(fastify) {
  fastify.get("/conversations", { preHandler: [fastify.authenticate] }, handleGetConversations);
  fastify.get("/message/:eventId", { preHandler: [fastify.authenticate] }, handleGetMessage);
  fastify.get("/conversation/:eventId/members", { preHandler: [fastify.authenticate] }, handleGetConversationMembers);
  fastify.post("/message", { preHandler: [fastify.authenticate] }, handleCreateMessage);
  fastify.delete("/message/:id", handleDeleteMessage);
}
