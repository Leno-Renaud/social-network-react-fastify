export async function searchVoyages(server, { lieu, dateDebut, dateFin }) {
    let query = `SELECT id, username, lieu, startdate::date AS "dateDebut", enddate::date AS "dateFin", description AS bio FROM voyages WHERE 1=1`;
    const params = [];

    if (lieu) {
        params.push(`%${lieu}%`);
        query += ` AND lieu ILIKE $${params.length}`;
    }
    if (dateDebut) {
        params.push(dateDebut);
        query += ` AND enddate::date >= $${params.length}::date`;
    }
    if (dateFin) {
        params.push(dateFin);
        query += ` AND startdate::date <= $${params.length}::date`;
    }

    query += ` ORDER BY startdate ASC`;

    const res = await server.pg.query(query, params);
    return res.rows;
}

export async function createVoyage(server, { username, lieu, dateDebut, dateFin, bio }) {
    const res = await server.pg.query(
        `INSERT INTO voyages (username, title, startdate, enddate, description, lieu)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [username, `Voyage vers ${lieu}`, dateDebut, dateFin, bio || "", lieu]
    );
    return res.rows[0];
}

export async function joinTravelCompanion(server, requester, voyageId, travelerUsername) {
    const [traveler1, traveler2] = [requester, travelerUsername].sort((a, b) =>
        a.localeCompare(b)
    );

    const existingRes = await server.pg.query(
        `SELECT conversation_event_id
         FROM travel_companions
         WHERE voyage_id = $1 AND traveler1 = $2 AND traveler2 = $3
         LIMIT 1`,
        [voyageId, traveler1, traveler2]
    );

    if (existingRes.rows.length > 0) {
        return { eventId: existingRes.rows[0].conversation_event_id, created: false };
    }

    await server.pg.query("BEGIN");
    try {
        const createdEvent = await server.pg.query(
            `INSERT INTO events (username, title, type, startdate, description, numberofpeople, opento, longitude, latitude)
             VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, $6, $7, $8)
             RETURNING id`,
            [
                requester,
                `Compagnons de voyage: ${traveler1} & ${traveler2}`,
                "autre",
                `${requester} wants to be your travel companion`,
                2,
                [],
                0,
                0,
            ]
        );

        const eventId = createdEvent.rows[0].id;

        await server.pg.query(
            "INSERT INTO event_participants (event_id, user_id) VALUES ($1, $2), ($1, $3)",
            [eventId, traveler1, traveler2]
        );

        await server.pg.query(
            `INSERT INTO travel_companions (voyage_id, traveler1, traveler2, conversation_event_id, created_by)
             VALUES ($1, $2, $3, $4, $5)`,
            [voyageId, traveler1, traveler2, eventId, requester]
        );

        await server.pg.query(
            "INSERT INTO messages (event_id, sender, content) VALUES ($1, $2, $3)",
            [eventId, "system", `${requester} wants to be your travel companion`]
        );

        await server.pg.query("COMMIT");
        return { eventId, created: true };
    } catch (error) {
        await server.pg.query("ROLLBACK");
        throw error;
    }
}
