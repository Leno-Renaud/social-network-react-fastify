import * as MessageService from "../services/message.service.js";

export async function emitMessageCreated(server, createdMessage) {
  if (!createdMessage?.event_id || !createdMessage?.id) return;

  const participants = await MessageService.getEventParticipants(
    server.pg,
    createdMessage.event_id
  );
  for (const participant of participants) {
    if (!participant?.user_id) continue;
    const event = await MessageService.getConversationNameForUser(
      server.pg,
      createdMessage.event_id,
      participant.user_id
    );
    const realtimeMessage = {
      ...createdMessage,
      event_name: event?.event_name || null,
    };
    server.io
      ?.to(`user:${participant.user_id}`)
      .emit("message:new", realtimeMessage);
  }
}