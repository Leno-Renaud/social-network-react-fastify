import { useEffect, useState } from "react";
import ChatWindow from "../Components/Chat/ChatWindow";
import MessageInput from "../Components/Chat/MessageInput";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const conversationId = 1; // temporaire

  useEffect(() => {
    fetch(`http://localhost:8888/messages/${conversationId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>Chat</h1>

      <ChatWindow messages={messages} />

      <MessageInput
        conversationId={conversationId}
        setMessages={setMessages}
      />
    </div>
  );
}