export async function getConversations(db, username) {
  const result = await db.query(`
  SELECT
    latest.event_id,
    e.title AS event_name,
    latest.content,
    latest.created_at
  FROM (
    SELECT
      m.event_id,
      m.content,
      m.created_at,
      ROW_NUMBER() OVER (
        PARTITION BY m.event_id
        ORDER BY m.created_at DESC
      ) AS rn
    FROM messages m
    JOIN event_participants ep
      ON m.event_id = ep.event_id
    WHERE ep.user_id = $1
  ) AS latest
  JOIN events e
    ON e.id = latest.event_id
  WHERE latest.rn = 1
  ORDER BY latest.created_at DESC, latest.event_id DESC;
  `, [username]);
  return result.rows;
}

export async function getMessage(db, username, eventId) {
  const result = await db.query(
    "SELECT m.* FROM messages m JOIN event_participants ep ON m.event_id = ep.event_id WHERE ep.user_id = $1 AND m.event_id = $2 ORDER BY m.created_at ASC;",
    [username, eventId]
  );
  return result.rows;
}

export async function createMessage(db, sender, { eventId, message }) {
  const query = `
    INSERT INTO messages(event_id, sender, content)
    VALUES($1, $2, $3) RETURNING *;
  `;
  const result = await db.query(query, [eventId, sender, message]);
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
