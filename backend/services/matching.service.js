export async function searchVoyages(server, { lieu, dateDebut, dateFin }) {
    let query = `SELECT id, username, lieu, date_debut, date_fin, bio FROM voyages WHERE 1=1`;
    const params = [];

    if (lieu) {
        params.push(`%${lieu}%`);
        query += ` AND lieu ILIKE $${params.length}`;
    }
    if (dateDebut) {
        params.push(dateDebut);
        query += ` AND date_fin >= $${params.length}`;
    }
    if (dateFin) {
        params.push(dateFin);
        query += ` AND date_debut <= $${params.length}`;
    }

    query += ` ORDER BY date_debut ASC`;

    const res = await server.pg.query(query, params);
    return res.rows.map(row => ({
        id: row.id,
        username: row.username,
        lieu: row.lieu,
        dateDebut: row.date_debut,
        dateFin: row.date_fin,
        bio: row.bio,
    }));
}

export async function createVoyage(server, { username, lieu, dateDebut, dateFin, bio }) {
    const res = await server.pg.query(
        `INSERT INTO voyages (username, lieu, date_debut, date_fin, bio)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [username, lieu, dateDebut, dateFin, bio]
    );
    return res.rows[0];
}
