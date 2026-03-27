export async function createVoyage(server, username, startDate, endDate, description, lieu, createdAt){
    await server.pg.query("INSERT INTO voyages (username, lieu, date_debut, date_fin, bio, created_at) VALUES ($1,$2,$3,$4, $5, $6)", [username, lieu, startDate, endDate, description, createdAt])
}

export async function getVoyages(server, type, date){
    const { rows } = await server.pg.query("SELECT * FROM voyages WHERE type = $1 AND startDate >= $2::date", [type, date])
    return rows
}

export async function getUserVoyages(server, username){
    const { rows } = await server.pg.query("SELECT * FROM voyages WHERE username = $1", [username])
    return rows
}