export async function createVoyage(server, username, title, startDate, endDate, description, lieu){
    await server.pg.query("INSERT INTO voyages (username, title, startdate, enddate, description, lieu) VALUES ($1,$2,$3,$4, $5, $6)", [username, title, startDate, endDate, description, lieu])
}

export async function getVoyages(server, startDate, endDate, lieu){
    const { rows } = await server.pg.query(
        "SELECT * FROM voyages WHERE startdate::date <= $2::date AND enddate::date >= $1::date AND lieu = $3",
        [startDate, endDate, lieu]
    )
    return rows
}

export async function getUserVoyages(server, username){
    const { rows } = await server.pg.query("SELECT * FROM voyages WHERE username = $1", [username])
    return rows
}