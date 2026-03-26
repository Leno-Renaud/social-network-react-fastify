import { useState } from "react";
import { sendMessage } from "../../../../Api/message.api";
import styles from "./MessageInput.module.scss";

export default function MessageInput({ selectedConversationId }) {
  const [text, setText] = useState("");

  const handleSendMessage = async (event) => {
    event?.preventDefault();

    if (!selectedConversationId || !text.trim()) return;

    try {
      await sendMessage(selectedConversationId, text);
      setText("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
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