import { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ChatWindow from "../../Components/Chat/ChatWindow/ChatWindow";
import { AuthContext } from "../../Context/AuthContext";
import { getConversations, getConversationMessages } from "../../Api/message.api";
import Conversations from "../../Components/Chat/Conversations/Conversations";
import {
  appendMessageIfNew,
  listenRealtimeMessages,
  mergeConversation,
  toConversationPreview,
} from "../../realtime/chat.realtime";

import styles from './Chat.module.scss'

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const { user } = useContext(AuthContext);
  const username = user?.username;
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const selectedConversation = conversations.find((c) => c.event_id === selectedConversationId) || null;

  const upsertConversation = useCallback((incomingConversation) => {
    setConversations((previous) => mergeConversation(previous, incomingConversation));
  }, []);

  const refreshConversations = useCallback(async () => {
    const fetchedConversations = await getConversations();
    const safeConversations = Array.isArray(fetchedConversations)
      ? fetchedConversations
      : [];

    setConversations(safeConversations);
    setSelectedConversationId((previousId) => {
      const queryId = Number(conversationId);
      if (queryId && safeConversations.some((conv) => conv.event_id === queryId)) {
        return queryId;
      }

      if (
        previousId &&
        safeConversations.some((conv) => conv.event_id === previousId)
      ) {
        return previousId;
      }

      return safeConversations[0]?.event_id ?? null;
    });
  }, [conversationId]);

  const refreshMessages = useCallback(async (conversationId) => {
    if (!username || !conversationId) {
      setMessages([]);
      return;
    }

    const conversationMessages = await getConversationMessages(conversationId);
    setMessages(Array.isArray(conversationMessages) ? conversationMessages : []);
  }, [username]);

  useEffect(() => {
    if (!username) return;

    let isCancelled = false;

    async function loadChatData() {
      try {
        await refreshConversations();
        if (isCancelled) return;
      } catch (error) {
        console.error("Erreur lors du chargement des conversations:", error);

        if (isCancelled) return;
        setConversations([]);
      }
    }

    loadChatData();

    return () => {
      isCancelled = true;
    };
  }, [refreshConversations, username]);

  useEffect(() => {
    if (!username || !selectedConversationId) {
      const timeoutId = setTimeout(() => {
        setMessages([]);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    let isCancelled = false;

    async function loadConversationMessages() {
      try {
        await refreshMessages(selectedConversationId);
        if (isCancelled) return;
      } catch (error) {
        console.error("Erreur lors du chargement des messages:", error);

        if (isCancelled) return;
        setMessages([]);
      }
    }

    loadConversationMessages();

    return () => {
      isCancelled = true;
    };
  }, [refreshMessages, selectedConversationId, username]);

  useEffect(() => {
    if (username) return;

    const timeoutId = setTimeout(() => {
      setConversations([]);
      setSelectedConversationId(null);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [username]);

  useEffect(() => {
    const handleMessageNew = (incomingMessage) => {
      const preview = toConversationPreview(incomingMessage);
      if (preview) {
        upsertConversation(preview);
      }

      if (!selectedConversationId) return;

      setMessages((previousMessages) => {
        return appendMessageIfNew(
          previousMessages,
          incomingMessage,
          selectedConversationId
        );
      });
    };

    const handleSocketError = (error) => {
      console.error("Erreur socket:", error?.message || error);
    };

    return listenRealtimeMessages({
      username,
      onMessageNew: handleMessageNew,
      onSocketError: handleSocketError,
    });
  }, [selectedConversationId, upsertConversation, username]);

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
          selectedConversationId={selectedConversationId}
          selectedConversation={selectedConversation}
          currentUsername={username}
        />
      </div>
    </div>
  );
}