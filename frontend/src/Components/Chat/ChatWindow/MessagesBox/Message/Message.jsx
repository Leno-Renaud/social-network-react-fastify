import styles from "./Message.module.scss";

export default function Message({ message, isOwnMessage }) {
  if (!message?.content) return null;

  const messageClassName = isOwnMessage ? styles.ownMessage : styles.message;

  return (
    <div className={messageClassName}>
      <article className={styles.bubble}>
        {!isOwnMessage ? <p className={styles.sender}>{message?.sender || "inconnu"}</p> : null}
        <p className={styles.content}>{message?.content}</p>
      </article>
    </div>
  );
}
