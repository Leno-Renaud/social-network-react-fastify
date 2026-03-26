import MessagesBox from "./MessagesBox/MessagesBox";
import MessageInput from "./MessageInput/MessageInput";
import styles from "./ChatWindow.module.scss";

export default function ChatWindow({
  messages,
  selectedConversationId,
  currentUsername,
}) {
  return (
    <div className={styles.chatWindow}>
      <MessagesBox messages={messages} currentUsername={currentUsername} />
      <MessageInput selectedConversationId={selectedConversationId} />
    </div>
  );
}