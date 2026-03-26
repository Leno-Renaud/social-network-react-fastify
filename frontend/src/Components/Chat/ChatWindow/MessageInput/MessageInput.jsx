import { useState } from "react";
import { getConversationMessages, sendMessage } from "../../../../Api/message.api";
import styles from "./MessageInput.module.scss";

export default function MessageInput({
  setMessages,
  selectedConversationId,
  onMessageSent,
}) {
  const [text, setText] = useState("");

  const handleSendMessage = async (event) => {
    event?.preventDefault();

    if (!selectedConversationId || !text.trim()) return;

    await sendMessage(selectedConversationId, text);

    if (onMessageSent) {
      await onMessageSent(selectedConversationId);
    } else {
      const data = await getConversationMessages(selectedConversationId);
      setMessages(Array.isArray(data) ? data : []);
    }

    setText("");
  };

  return (
    <form className={styles.composer} onSubmit={handleSendMessage}>
      <input
        className={styles.input}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!selectedConversationId}
        placeholder="Message..."
      />
      <button
        type="submit"
        className={styles.sendButton}
        disabled={!selectedConversationId}
      >
        Envoyer
      </button>
    </form>
  );
}