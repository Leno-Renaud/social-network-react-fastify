import * as MessageService from "../services/message.service.js";

export async function emitMessageCreated(server, createdMessage) {
  if (!createdMessage?.event_id || !createdMessage?.id) return;

  const participants = await MessageService.getEventParticipants(
    server.pg,
    createdMessage.event_id
  );
  const event = await MessageService.getEventNameById(
    server.pg,
    createdMessage.event_id
  );
  const realtimeMessage = {
    ...createdMessage,
    event_name: event?.event_name || null,
  };

  participants.forEach((participant) => {
    if (!participant?.user_id) return;
    server.io
      ?.to(`user:${participant.user_id}`)
      .emit("message:new", realtimeMessage);
  });
}