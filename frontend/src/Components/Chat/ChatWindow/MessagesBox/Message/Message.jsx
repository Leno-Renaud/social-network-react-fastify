import styles from "./Message.module.scss";

export default function Message({ message, isOwnMessage }) {
  if (!message?.content) return null;

  return (
    <div className={isOwnMessage ? `${styles.row} ${styles.ownRow}` : styles.row}>
      <article className={isOwnMessage ? `${styles.bubble} ${styles.ownBubble}` : styles.bubble}>
        {!isOwnMessage ? <p className={styles.sender}>{message?.sender || "inconnu"}</p> : null}
        <p className={styles.content}>{message?.content}</p>
      </article>
    </div>
  );
}
