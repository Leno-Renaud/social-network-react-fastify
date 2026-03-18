export async function createEvent(server, username, title, type, startDate, description, numberOfPeople, openTo, localization){
    await server.pg.query("INSERT INTO events (username, title, type, startDate, description, numberOfPeople, openTo, longitude, latitude) VALUES ($1,$2,$3,$4, $5, $6, $7, $8, $9)", [username, title, type, startDate, description, numberOfPeople, openTo, localization.lng, localization.lat])
}

export async function getEvents(server, type, date){
    const { rows } = await server.pg.query("SELECT * FROM events WHERE type = $1 AND startDate >= $2::date", [type, date])
    return rows
}

export async function getUserEvents(server, username){
    const { rows } = await server.pg.query("SELECT * FROM events WHERE username = $1", [username])
    return rows
}