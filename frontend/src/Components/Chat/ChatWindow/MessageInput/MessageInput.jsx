import { useState } from "react";
import { getConversationMessages, sendMessage } from "../../../../Api/message.api";
import styles from "./MessageInput.module.scss";

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
    <div className={styles.composer}>
      <input
        className={styles.input}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!selectedConversationId}
        placeholder="Message..."
      />
      <button
        className={styles.sendButton}
        onClick={handleSendMessage}
        disabled={!selectedConversationId}
      >
        Envoyer
      </button>
    </div>
  );
}