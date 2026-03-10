import bcrypt from "bcrypt"


export async function registerUser(server, username, password){
    const existing = await server.pg.query("SELECT 1 FROM users WHERE username=$1", [username])
    if(existing.rows.length){
        throw new Error("Username already taken")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await server.pg.query("INSERT INTO users (username, password) VALUES ($1,$2)", [username, hashedPassword])
}


export async function getMe(server, username){
    const res = await server.pg.query("SELECT username FROM users WHERE username=$1", [username])
    if(!res.rows.length){
        throw new Error("User not found")
    }
    return res.rows[0]
}

export async function loginUser(server, username, password){
    const res = await (server.pg.query("SELECT * FROM users WHERE username=$1",[username]))
    if(!res.rows.length){
         throw new Error("User not found")
    }
    const match = await bcrypt.compare(password, res.rows[0].password)
    if(!match){
        throw new Error("Invalid Credentials")
    }
    return server.jwt.sign({username})
}