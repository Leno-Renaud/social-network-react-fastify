import { useState } from "react";
import { getConversationMessages, sendMessage } from "../../Api/message.api";

export default function MessageInput({ setMessages }) {
  const [eventId, setEventId] = useState("");
  const [text, setText] = useState("");

  const handleSendMessage = async () => {
    if (!eventId || !text.trim()) return;

    await sendMessage(eventId, text);

    const data = await getConversationMessages(eventId);
    setMessages(Array.isArray(data) ? data : []);

    setText("");
  };

  return (
    <div>
      <input
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        placeholder="Event ID"
      />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Message..."
      />
      <button onClick={handleSendMessage}>Envoyer</button>
    </div>
  );
}