export async function createEvent(server, username, title, type, startDate, description, numberOfPeople, openTo, localization){
    const { rows } = await server.pg.query(
        "INSERT INTO events (username, title, type, startDate, description, numberOfPeople, openTo, longitude, latitude) VALUES ($1,$2,$3,$4, $5, $6, $7, $8, $9) RETURNING id",
        [username, title, type, startDate, description, numberOfPeople, openTo, localization.lng, localization.lat]
    )

    const eventId = rows[0].id

    await server.pg.query(
        "INSERT INTO event_participants (event_id, user_id) VALUES ($1, $2)",
        [eventId, username]
    )

    await server.pg.query(
        "INSERT INTO messages (event_id, sender, content) VALUES ($1, $2, $3)",
        [eventId, "system", `Event "${title}" created by ${username}`]
    )
}

export async function getEvents(server, type, date){
    let query = "SELECT * FROM events WHERE 1=1";
    const params = [];
    if (type) { params.push(type); query += ` AND type = $${params.length}`; }
    if (date) { params.push(date); query += ` AND startDate >= $${params.length}::date`; }
    query += " ORDER BY startdate ASC";
    const { rows } = await server.pg.query(query, params);
    return rows;
}

export async function getUserEvents(server, username){
    const { rows } = await server.pg.query("SELECT * FROM events WHERE username = $1", [username])
    return rows
}

export async function leaveEvent(server, eventId, username){
    const { rows } = await server.pg.query(
        "SELECT username FROM events WHERE id = $1", [eventId]
    );
    if (rows[0]?.username === username) throw new Error("Tu ne peux pas quitter un événement que tu as créé.");
    await server.pg.query(
        "DELETE FROM event_participants WHERE event_id = $1 AND user_id = $2", [eventId, username]
    );
    await server.pg.query(
        "INSERT INTO messages (event_id, sender, content) VALUES ($1, $2, $3)",
        [eventId, "system", `${username} a quitté l'événement`]
    );
}

export async function getParticipants(server, eventId){
    const { rows } = await server.pg.query(
        "SELECT user_id FROM event_participants WHERE event_id = $1", [eventId]
    );
    return rows;
}

export async function getMyEvents(server, username){
    const { rows } = await server.pg.query(
        `SELECT DISTINCT e.*,
            CASE WHEN e.username = $1 THEN 'created' ELSE 'joined' END as role
         FROM events e
         JOIN event_participants ep ON ep.event_id = e.id
         WHERE ep.user_id = $1
         ORDER BY e.startdate ASC`,
        [username]
    )
    return rows
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
    await db.query("INSERT INTO messages (event_id, sender, content) VALUES ($1, $2, $3)", [eventId, "system", `${username} has joined the event`]);
}