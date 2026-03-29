import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConversationMembers } from "../../../Api/message.api";
import MessagesBox from "./MessagesBox/MessagesBox";
import MessageInput from "./MessageInput/MessageInput";
import styles from "./ChatWindow.module.scss";
import PeopleIcon from "../../../Assets/People.png";

export default function ChatWindow({
  messages,
  selectedConversationId,
  selectedConversation,
  currentUsername,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [membersError, setMembersError] = useState("");
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(false);
    setMembers([]);
    setMembersError("");
  }, [selectedConversationId]);

  useEffect(() => {
    function onClickOutside(event) {
      if (!menuRef.current?.contains(event.target)) setIsOpen(false);
    }
    function onEsc(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  async function toggleMembers() {
    if (!selectedConversationId) return;
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (!nextOpen || members.length > 0) return;

    try {
      setLoadingMembers(true);
      setMembersError("");
      const data = await getConversationMembers(selectedConversationId);
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      setMembersError(err.message || "Impossible de charger les membres");
    } finally {
      setLoadingMembers(false);
    }
  }

  function goToProfile(username) {
    setIsOpen(false);
    navigate(`/profile/${username}?tab=history`);
  }

  return (
    <div className={styles.chatWindow}>
      <header className={styles.chatHeader}>
        <h3 className={styles.chatTitle}>{selectedConversation?.event_name || "Conversation"}</h3>
        <div className={styles.membersMenu} ref={menuRef}>
          <button
            type="button"
            className={styles.membersButton}
            onClick={toggleMembers}
            disabled={!selectedConversationId}
            aria-label="Afficher les membres de la conversation"
            aria-expanded={isOpen}
          >
            <img src={PeopleIcon} alt="Membres" className={styles.membersIcon} />
          </button>

          {isOpen && (
            <div className={styles.membersDropdown}>
              {loadingMembers && <p className={styles.membersState}>Chargement...</p>}
              {!loadingMembers && membersError && <p className={styles.membersState}>{membersError}</p>}
              {!loadingMembers && !membersError && members.length === 0 && (
                <p className={styles.membersState}>Aucun membre</p>
              )}
              {!loadingMembers && !membersError && members.length > 0 && (
                <ul className={styles.membersList}>
                  {members.map((member) => (
                    <li key={member.username}>
                      <button
                        type="button"
                        className={styles.memberItem}
                        onClick={() => goToProfile(member.username)}
                      >
                        {member.username}
                        {member.username === currentUsername ? " (toi)" : ""}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </header>
      <MessagesBox messages={messages} currentUsername={currentUsername} />
      <MessageInput selectedConversationId={selectedConversationId} />
    </div>
  );
}