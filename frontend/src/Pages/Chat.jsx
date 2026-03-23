import { useContext, useEffect, useState } from "react";
import ChatWindow from "../Components/Chat/ChatWindow";
import MessageInput from "../Components/Chat/MessageInput";
import { AuthContext } from "../Context/AuthContext";
import { getConversations, getConversationMessages } from "../Api/message.api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);
  const username = user?.username;

  useEffect(() => {
    if (!username) return;
    async function loadChatData() {
      //montre toutes les conversations comme liste d'objets
      const conversations = await getConversations();
      alert(JSON.stringify(conversations));

      //demande à l'utilisateur de choisir une conversation (par id)
      const inputConversationId = window.prompt("id conv ?");
      if (!inputConversationId) return;

      //charge les messages de la conversation choisie
      const conversationMessages = await getConversationMessages(inputConversationId);
      setMessages(Array.isArray(conversationMessages) ? conversationMessages : []);
      alert(JSON.stringify(conversationMessages));
    }

    loadChatData();
  }, [username]);

  return (
    <div>
      <h1>Chat</h1>

      <ChatWindow messages={messages} />

      <MessageInput
        setMessages={setMessages}
      />
    </div>
  );
}