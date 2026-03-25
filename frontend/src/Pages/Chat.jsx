import { useContext, useEffect, useState } from "react";
import ChatWindow from "../Components/Chat/ChatWindow/ChatWindow";
import MessageInput from "../Components/Chat/ChatWindow/MessageInput/MessageInput";
import { AuthContext } from "../Context/AuthContext";
import { getConversations, getConversationMessages } from "../Api/message.api";
import Conversations from "../Components/Chat/Conversations/Conversations";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const { user } = useContext(AuthContext);
  const username = user?.username;

  useEffect(() => {
    if (!username) return;

    async function loadChatData() {
      try {
        const fetchedConversations = await getConversations();
        const safeConversations = Array.isArray(fetchedConversations) ? fetchedConversations : [];

        setConversations(safeConversations);

        if (safeConversations.length > 0) {
          setSelectedConversationId(safeConversations[safeConversations.length - 1].event_id);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des conversations:", error);
        setConversations([]);
      }
    }

    loadChatData();
  }, [username]);

  useEffect(() => {
    if (!username || !selectedConversationId) {
      setMessages([]);
      return;
    }

    async function loadConversationMessages() {
      try {
        const conversationMessages = await getConversationMessages(selectedConversationId);
        setMessages(Array.isArray(conversationMessages) ? conversationMessages : []);
      } catch (error) {
        console.error("Erreur lors du chargement des messages:", error);
        setMessages([]);
      }
    }

    loadConversationMessages();
  }, [username, selectedConversationId]);

  return (
    <div>
      <Conversations
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
      />
      <ChatWindow messages={messages} />
      <MessageInput
        setMessages={setMessages}
        selectedConversationId={selectedConversationId}
      />
    </div>
  );
}