export async function getConversations(db, username) {
  const result = await db.query(`
  SELECT DISTINCT ON (m.event_id)
      m.event_id,
      e.title AS event_name,
      m.content,
      m.created_at
  FROM messages m
  JOIN event_participants ep 
      ON m.event_id = ep.event_id
  JOIN events e 
      ON e.id = m.event_id
  WHERE ep.user_id = $1
  ORDER BY m.event_id, m.created_at DESC;
  `, [username]);
  return result.rows;
}

export async function getMessage(db, username, eventId) {
  const result = await db.query("SELECT m.* FROM messages m JOIN event_participants ep ON m.event_id = ep.event_id WHERE ep.user_id = $1 AND m.event_id = *2;"[username, eventId]);
  return result.rows;
}

export async function createMessage(db, sender, { receiver, message }) {
  const existingUser = await db.query("SELECT * FROM users WHERE username=$1;", [receiver]);
  if (existingUser.rows.length === 0) {
    throw new Error("Receiver does not exist");
  }
  const query = `
    INSERT INTO messages(sender, receiver, message)
    VALUES($1, $2, $3) RETURNING *;
  `;
  const result = await db.query(query, [sender, receiver, message]);
  return result.rows[0];
}

export async function deleteMessage(db, id) {
    const query = `
      DELETE FROM messages
      WHERE id = $1 RETURNING *;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
}


export async function joinEvent(db, eventId, username) {
    const event = await db.query("SELECT * FROM events WHERE id = $1", [eventId]);
    if (event.rows.length === 0) {
        throw new Error("Event not found");
    }
    const existingParticipation = await db.query("SELECT * FROM event_participants WHERE event_id = $1 AND user_id = $2", [eventId, username]);
    if (existingParticipation.rows.length > 0) {
        throw new Error("User already joined this event");
    }
    await db.query("INSERT INTO event_participants (event_id, user_id) VALUES ($1, $2)", [eventId, username]);
}