import styles from './Conversations.module.scss'
import ConversationButton from './ConversationButton/ConversationButton';

export default function Conversations({
  conversations,
  selectedConversationId,
  onSelectConversation,
}) {
  return (
    <div className={styles.conversations}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>💬</span>
        <h2>Conversations</h2>
      </div>
      <div className={styles.list}>
        {(conversations || []).length === 0 ? (
          <p className={styles.empty}>Aucune conversation.<br/>Rejoins un événement pour commencer.</p>
        ) : (
          (conversations || []).map((conv) => (
            <ConversationButton
              key={conv.event_id}
              conversation={conv}
              selectedConversationId={selectedConversationId}
              onSelectConversation={onSelectConversation}
            />
          ))
        )}
      </div>
    </div>
  );
}
