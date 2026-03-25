import { useState } from "react";
import { getConversationMessages, sendMessage } from "../../../Api/message.api";

export default function MessageInput({ setMessages, selectedConversationId }) {
  const [text, setText] = useState("");

  const handleSendMessage = async () => {
    if (!selectedConversationId || !text.trim()) return;

    await sendMessage(selectedConversationId, text);

    const data = await getConversationMessages(selectedConversationId);
    setMessages(Array.isArray(data) ? data : []);

    setText("");
  };

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!selectedConversationId}
        placeholder="Message..."
      />
      <button onClick={handleSendMessage} disabled={!selectedConversationId}>
        Envoyer
      </button>
    </div>
  );
}