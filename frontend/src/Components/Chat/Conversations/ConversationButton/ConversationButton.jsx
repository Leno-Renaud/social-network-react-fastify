import styles from "./ConversationButton.module.scss";

export default function ConversationButton({
  conversation,
  selectedConversationId,
  onSelectConversation,
}) {
  const eventId = conversation?.event_id;
  const label = conversation?.event_name || `Event ${eventId}`;
  const isSelected = selectedConversationId === eventId;

  return (
    <button
      type="button"
      onClick={() => onSelectConversation?.(eventId)}
      className={isSelected ? `${styles.button} ${styles.selected}` : styles.button}
    >
      <span className={styles.title}>{label}</span>
      {conversation?.content ? <span className={styles.preview}>{conversation.content}</span> : null}
    </button>
  );
}
