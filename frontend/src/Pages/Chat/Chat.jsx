import { useContext, useEffect, useState } from "react";
import ChatWindow from "../../Components/Chat/ChatWindow/ChatWindow";
import { AuthContext } from "../../Context/AuthContext";
import { getConversations, getConversationMessages } from "../../Api/message.api";
import Conversations from "../../Components/Chat/Conversations/Conversations";

import styles from './Chat.module.scss'


export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const { user } = useContext(AuthContext);
  const username = user?.username;

  useEffect(() => {
    if (!username) return;

    let isActive = true;

    async function loadChatData() {
      try {
        const fetchedConversations = await getConversations();
        const safeConversations = Array.isArray(fetchedConversations)
          ? fetchedConversations
          : [];

        if (!isActive) return;

        setConversations(safeConversations);
        setSelectedConversationId((previousId) => {
          if (
            previousId &&
            safeConversations.some((conv) => conv.event_id === previousId)
          ) {
            return previousId;
          }

          return safeConversations[0]?.event_id ?? null;
        });
      } catch (error) {
        console.error("Erreur lors du chargement des conversations:", error);

        if (!isActive) return;
        setConversations([]);
      }
    }

    loadChatData();

    const intervalId = setInterval(loadChatData, 3000);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [username]);

  useEffect(() => {
    if (!username || !selectedConversationId) {
      setMessages([]);
      return;
    }

    let isActive = true;

    async function loadConversationMessages() {
      try {
        const conversationMessages = await getConversationMessages(selectedConversationId);

        if (!isActive) return;
        setMessages(Array.isArray(conversationMessages) ? conversationMessages : []);
      } catch (error) {
        console.error("Erreur lors du chargement des messages:", error);

        if (!isActive) return;
        setMessages([]);
      }
    }

    loadConversationMessages();

    const intervalId = setInterval(loadConversationMessages, 2000);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [username, selectedConversationId]);

  return (
    <div className={styles.chat}>
      <Conversations
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
      />
      <div className={styles.chatMain}>
        <ChatWindow
          messages={messages}
          setMessages={setMessages}
          selectedConversationId={selectedConversationId}
          currentUsername={username}
        />
      </div>
    </div>
  );
}