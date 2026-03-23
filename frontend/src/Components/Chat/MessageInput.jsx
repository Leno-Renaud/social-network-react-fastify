import { useState } from "react";

export default function MessageInput({ username, setMessages }) {
  const [text, setText] = useState("");

  const sendMessage = async () => {
    if (!username || !text.trim()) return;
    const token = localStorage.getItem("token");

    await fetch("http://localhost:8888/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        receiver: username,
        message: text,
      }),
    });

    // reload des messages après envoi
    fetch(`http://localhost:8888/message/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch(() => setMessages([]));

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