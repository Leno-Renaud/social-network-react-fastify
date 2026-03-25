export default function Conversations({
  conversations,
  selectedConversationId,
  onSelectConversation,
}) {
  return (
    <div>
      <h2>Conversations</h2>
      {(conversations || []).map((conv) => (
        <button
          key={conv.event_id}
          type="button"
          onClick={() => onSelectConversation?.(conv.event_id)}
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: selectedConversationId === conv.event_id ? "bold" : "normal",
          }}
        >
          {conv.event_name || `Event ${conv.event_id}`}
        </button>
      ))}
    </div>
  );
}