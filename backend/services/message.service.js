export async function getConversations(db, username) {
  const result = await db.query(`
  SELECT
    latest.event_id,
    COALESCE(
      CASE WHEN tc.traveler1 = $1 THEN tc.traveler2 ELSE tc.traveler1 END,
      e.title
    ) AS event_name,
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
  LEFT JOIN travel_companions tc
    ON tc.conversation_event_id = latest.event_id
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

export async function getEventParticipants(db, eventId) {
  const result = await db.query(
    "SELECT DISTINCT user_id FROM event_participants WHERE event_id = $1;",
    [eventId]
  );
  return result.rows;
}

export async function getConversationMembers(db, username, eventId) {
  const result = await db.query(
    `SELECT ep.user_id AS username
     FROM event_participants ep
     WHERE ep.event_id = $2
       AND EXISTS (
         SELECT 1
         FROM event_participants me
         WHERE me.event_id = $2 AND me.user_id = $1
       )
     ORDER BY ep.user_id ASC;`,
    [username, eventId]
  );
  return result.rows;
}

export async function getEventNameById(db, eventId) {
  const result = await db.query(
    "SELECT title AS event_name FROM events WHERE id = $1 LIMIT 1;",
    [eventId]
  );

  return result.rows[0] || null;
}

export async function getConversationNameForUser(db, eventId, username) {
  const result = await db.query(
    `SELECT COALESCE(
      CASE WHEN tc.traveler1 = $2 THEN tc.traveler2 ELSE tc.traveler1 END,
      e.title
    ) AS event_name
    FROM events e
    LEFT JOIN travel_companions tc ON tc.conversation_event_id = e.id
    WHERE e.id = $1
    LIMIT 1;`,
    [eventId, username]
  );

  return result.rows[0] || null;
}

export async function deleteMessage(db, id) {
    const query = `
      DELETE FROM messages
      WHERE id = $1 RETURNING *;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
}
