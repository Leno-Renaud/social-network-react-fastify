import { useState } from "react";

export default function MessageInput({ conversationId, setMessages }) {
  const [text, setText] = useState("");

  const sendMessage = async () => {
    await fetch("http://localhost:8888/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: text,
        conversation_id: conversationId,
        sender_id: 1,
      }),
    });

    // reload des messages après envoi
    fetch(`http://localhost:8888/messages/${conversationId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));

    setText("");
  };

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Message..."
      />
      <button onClick={sendMessage}>Envoyer</button>
    </div>
  );
}