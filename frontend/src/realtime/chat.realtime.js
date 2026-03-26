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

export function listenConversationUpdates({ username, onConversationNew, onSocketError }) {
  if (!username) {
    closeSharedSocket();
    return () => {};
  }

  const socket = getSharedSocket();
  if (!socket) return () => {};

  socket.on("conversation:new", onConversationNew);
  socket.on("connect_error", onSocketError);

  return () => {
    socket.off("conversation:new", onConversationNew);
    socket.off("connect_error", onSocketError);
  };
}

export function subscribeConversationRoom(conversationId, onMessageNew) {
  const socket = getSharedSocket();
  if (!socket || !conversationId) return () => {};

  socket.emit("conversation:join", conversationId);
  socket.on("message:new", onMessageNew);

  return () => {
    socket.emit("conversation:leave", conversationId);
    socket.off("message:new", onMessageNew);
  };
}