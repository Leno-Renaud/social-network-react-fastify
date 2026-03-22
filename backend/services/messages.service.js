export const getMessagesService = async (conversationId) => {
  return db.query('SELECT * FROM messages WHERE conversation_id=$1', [conversationId]);
};

export const sendMessageService = async (data) => {
  return db.query(
    'INSERT INTO messages (content, conversation_id, sender_id) VALUES ($1,$2,$3)',
    [data.content, data.conversation_id, data.sender_id]
  );
};