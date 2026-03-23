import { useContext, useEffect, useState } from "react";
import ChatWindow from "../Components/Chat/ChatWindow";
import MessageInput from "../Components/Chat/MessageInput";
import { AuthContext } from "../Context/AuthContext";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);
  const username = user?.username;

  useEffect(() => {
    if (!username) return;
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8888/message/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.log(err);
        setMessages([]);
      });
  }, [username]);

  return (
    <div>
      <h1>Chat</h1>

      <ChatWindow messages={messages} />

      <MessageInput
        username={username}
        setMessages={setMessages}
      />
    </div>
  );
}