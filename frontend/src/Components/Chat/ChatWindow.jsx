export default function ChatWindow({ messages }) {
  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          <b>{msg.sender_id}</b> : {msg.content}
        </div>
      ))}
    </div>
  );
}