import styles from './Conversations.module.scss'
import ConversationButton from './ConversationButton/ConversationButton';

export default function Conversations({
  conversations,
  selectedConversationId,
  onSelectConversation,
}) {
  return (
    <div className={styles.conversations}>
      <h2 className={styles.title}>Conversations</h2>
      <div className={styles.list}>
        {(conversations || []).map((conv) => (
          <ConversationButton
            key={conv.event_id}
            conversation={conv}
            selectedConversationId={selectedConversationId}
            onSelectConversation={onSelectConversation}
          />
        ))}
      </div>
    </div>
  );
}