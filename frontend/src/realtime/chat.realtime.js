import { closeSharedSocket, getSharedSocket } from "./socket.client";

export function mergeConversation(conversations, incomingConversation) {
  if (!incomingConversation?.event_id) return conversations;

  const remaining = conversations.filter(
    (conversation) => conversation.event_id !== incomingConversation.event_id
  );

  const mergedConversation = {
    ...conversations.find(
      (conversation) => conversation.event_id === incomingConversation.event_id
    ),
    ...incomingConversation,
  };

  const nextConversations = [mergedConversation, ...remaining];
  nextConversations.sort(
    (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
  );

  return nextConversations;
}

export function appendMessageIfNew(messages, incomingMessage, expectedEventId) {
  if (!incomingMessage?.id || incomingMessage.event_id !== expectedEventId) {
    return messages;
  }

  if (messages.some((message) => message.id === incomingMessage.id)) {
    return messages;
  }

  return [...messages, incomingMessage];
}

export function toConversationPreview(message) {
  if (!message?.event_id) return null;

  return {
    event_id: message.event_id,
    event_name: message.event_name || `Event ${message.event_id}`,
    content: message.content || "",
    created_at: message.created_at,
  };
}

export function listenRealtimeMessages({ username, onMessageNew, onSocketError }) {
  if (!username) {
    closeSharedSocket();
    return () => {};
  }

  const socket = getSharedSocket();
  if (!socket) return () => {};

  socket.on("message:new", onMessageNew);
  socket.on("connect_error", onSocketError);

  return () => {
    socket.off("message:new", onMessageNew);
    socket.off("connect_error", onSocketError);
  };
}