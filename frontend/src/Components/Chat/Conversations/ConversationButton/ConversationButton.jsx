import styles from "./ConversationButton.module.scss";

export default function ConversationButton({
  conversation,
  selectedConversationId,
  onSelectConversation,
}) {
  const eventId = conversation?.event_id;
  const label = conversation?.event_name || `Event ${eventId}`;
  const isSelected = selectedConversationId === eventId;
  const initial = label.charAt(0).toUpperCase();

  return (
    <button
      type="button"
      onClick={() => onSelectConversation?.(eventId)}
      className={isSelected ? `${styles.button} ${styles.selected}` : styles.button}
    >
      <div className={styles.avatar}>{initial}</div>
      <div className={styles.info}>
        <span className={styles.title}>{label}</span>
        {conversation?.content
          ? <span className={styles.preview}>{conversation.content}</span>
          : <span className={styles.preview}>Aucun message</span>
        }
      </div>
    </button>
  );
}
