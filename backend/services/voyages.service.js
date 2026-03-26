export async function createVoyage(server, username, title, startDate, endDate, description, lieu){
    await server.pg.query("INSERT INTO voyages (username, title, startDate, endDate, description, lieu) VALUES ($1,$2,$3,$4, $5, $6)", [username, title, startDate, endDate, description, lieu])
}

export async function getVoyages(server, type, date){
    const { rows } = await server.pg.query("SELECT * FROM voyages WHERE type = $1 AND startDate >= $2::date", [type, date])
    return rows
}

export async function getUserVoyages(server, username){
    const { rows } = await server.pg.query("SELECT * FROM voyages WHERE username = $1", [username])
    return rows
}