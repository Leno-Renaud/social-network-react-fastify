import { useEffect, useRef } from "react";
import Message from "./Message/Message";
import styles from "./MessagesBox.module.scss";

export default function MessagesBox({ messages, currentUsername }) {
  const containerRef = useRef(null);
  const safeMessages = Array.isArray(messages) ? messages : [];

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [safeMessages]);

  return (
    <section className={styles.messagesBox} ref={containerRef}>
      {safeMessages.map((msg) => (
        <Message
          key={msg.id}
          message={msg}
          isOwnMessage={msg?.sender === currentUsername}
        />
      ))}
    </section>
  );
}
