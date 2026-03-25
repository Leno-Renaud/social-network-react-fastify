export default function ChatWindow({ messages }) {
  return (
    <div>
      {(messages || []).map((msg) => (
        <div key={msg.id}>
          <b>{msg.sender || msg.sender_id || "inconnu"}</b> : {msg.content}
        </div>
      ))}
    </div>
  );
}