import { useEffect, useRef } from "react";
import Message from "./Message/Message";
import styles from "./MessagesBox.module.scss";

export default function MessagesBox({ messages, currentUsername }) {
  const endRef = useRef(null);
  const safeMessages = Array.isArray(messages) ? messages : [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [safeMessages.length]);

  return (
    <section className={styles.messagesBox}>
      {safeMessages.map((msg) => (
        <Message
          key={msg.id}
          message={msg}
          isOwnMessage={msg?.sender === currentUsername}
        />
      ))}
      <div ref={endRef} />
    </section>
  );
}