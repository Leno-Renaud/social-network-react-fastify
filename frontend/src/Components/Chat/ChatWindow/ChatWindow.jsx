import MessagesBox from "./MessagesBox/MessagesBox";
import MessageInput from "./MessageInput/MessageInput";
import styles from "./ChatWindow.module.scss";

export default function ChatWindow({
  messages,
  selectedConversationId,
  currentUsername,
  conversationName,
}) {
  if (!selectedConversationId) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>💬</div>
        <h3>Sélectionne une conversation</h3>
        <p>Choisis un événement dans la liste pour commencer à discuter</p>
      </div>
    );
  }

  return (
    <div className={styles.chatWindow}>
      {conversationName && (
        <div className={styles.header}>
          <div className={styles.headerAvatar}>{conversationName.charAt(0).toUpperCase()}</div>
          <div>
            <h3>{conversationName}</h3>
            <span>Conversation de l'événement</span>
          </div>
        </div>
      )}
      <MessagesBox messages={messages} currentUsername={currentUsername} />
      <MessageInput selectedConversationId={selectedConversationId} />
    </div>
  );
}
