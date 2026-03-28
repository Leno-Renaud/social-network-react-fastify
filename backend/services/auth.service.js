import bcrypt from "bcrypt"


export async function registerUser(server, username, password, insa, email){
    const existing = await server.pg.query("SELECT 1 FROM users WHERE username=$1", [username])
    if(existing.rows.length){
        throw new Error("Username already taken")
    }
    const emailTaken = await server.pg.query("SELECT 1 FROM users WHERE email=$1", [email])
    if(emailTaken.rows.length){
        throw new Error("Cet email est déjà utilisé")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await server.pg.query("INSERT INTO users (username, password, insa, email) VALUES ($1,$2,$3,$4)", [username, hashedPassword, insa, email])
}


export async function getMe(server, username){
    const res = await server.pg.query("SELECT username, insa, email, bio FROM users WHERE username=$1", [username])
    if(!res.rows.length){
        throw new Error("User not found")
    }
    return res.rows[0]
}

export async function getProfile(server, username){
    const res = await server.pg.query("SELECT username, insa, bio FROM users WHERE username=$1", [username])
    if(!res.rows.length){
        throw new Error("Utilisateur introuvable")
    }
    return res.rows[0]
}

export async function updateBio(server, username, bio){
    await server.pg.query("UPDATE users SET bio=$1 WHERE username=$2", [bio, username])
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