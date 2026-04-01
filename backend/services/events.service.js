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

export async function getEvents(server, type, date, insaPrefix){
    if (insaPrefix) {
        const { rows } = await server.pg.query(
            "SELECT * FROM events WHERE type = $1 AND startDate::date >= $2::date AND EXISTS (SELECT 1 FROM unnest(opento) dep WHERE dep LIKE $3)",
            [type, date, `${insaPrefix}-%`]
        )
        return rows
    }
    const { rows } = await server.pg.query("SELECT * FROM events WHERE type = $1 AND startDate::date >= $2::date", [type, date])
    return rows
}

export async function getUserEvents(server, username){
    const { rows } = await server.pg.query("SELECT * FROM events WHERE username = $1", [username])
    return rows
}


export async function joinEvent(db, eventId, username) {
    const event = await db.query("SELECT * FROM events WHERE id = $1", [eventId]);
    if (event.rows.length === 0) {
        throw new Error("Event not found");
    }

    const userRes = await db.query("SELECT insa FROM users WHERE username = $1", [username]);
    const userInsa = userRes.rows[0]?.insa;
    const insaPrefix = userInsa ? userInsa.split('-')[0] : null;

    if (insaPrefix) {
        const openTo = event.rows[0].opento || [];
        const allowed = openTo.some(dep => dep.startsWith(insaPrefix + '-'));
        if (!allowed) {
            throw new Error(`Cet événement n'est pas ouvert à votre INSA`);
        }
    }

    const existingParticipation = await db.query("SELECT * FROM event_participants WHERE event_id = $1 AND user_id = $2", [eventId, username]);
    if (existingParticipation.rows.length > 0) {
        throw new Error("User already joined this event");
    }
    await db.query("INSERT INTO event_participants (event_id, user_id) VALUES ($1, $2)", [eventId, username]);
    await db.query("INSERT INTO messages (event_id, sender, content) VALUES ($1, $2, $3)", [eventId, "system", `${username} has joined the event`]);
}