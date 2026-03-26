import * as MessageService from "../services/message.service.js";

export async function emitMessageCreated(server, createdMessage) {
  if (!createdMessage?.event_id || !createdMessage?.id) return;

  server.io
    ?.to(`conversation:${createdMessage.event_id}`)
    .emit("message:new", createdMessage);

  const participants = await MessageService.getEventParticipants(
    server.pg,
    createdMessage.event_id
  );
  const conversationPreview = await MessageService.getConversationPreviewForMessage(
    server.pg,
    createdMessage.id
  );

  if (!conversationPreview) return;

  participants.forEach((participant) => {
    if (!participant?.user_id) return;
    server.io
      ?.to(`user:${participant.user_id}`)
      .emit("conversation:new", conversationPreview);
  });
}