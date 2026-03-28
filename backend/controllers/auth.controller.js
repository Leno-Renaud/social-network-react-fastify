import * as AuthService from "../services/auth.service.js"

export async function me(request, reply){
    try {
        const { username } = request.user
        const user = await AuthService.getMe(request.server, username)
        reply.send({ user })
    } catch(err) {
        return reply.code(500).send({ message: err.message })
    }
}


export async function register(request, reply){
    const {username, password, insa, email} = request.body
    if (!insa) return reply.code(400).send({ message: "Veuillez sélectionner votre INSA" })
    if (!email) return reply.code(400).send({ message: "L'email est obligatoire" })
    if (!/^[^@]+@insa-[^@]+\.fr$/.test(email)) {
        return reply.code(400).send({ message: "L'email doit être une adresse @insa-....fr" })
    }
    try {
        await AuthService.registerUser(request.server, username, password, insa, email)
        reply.send({message: "User created"})
    } catch(err) {
        return reply.code(500).send({message: err.message})
    }
}

export async function getProfile(request, reply){
    try {
        const { username } = request.params
        const profile = await AuthService.getProfile(request.server, username)
        reply.send({ profile })
    } catch(err) {
        return reply.code(404).send({ message: err.message })
    }
}

export async function updateBio(request, reply){
    try {
        const { username } = request.user
        const { bio } = request.body
        if (bio && bio.length > 300) return reply.code(400).send({ message: "Bio trop longue (max 300 caractères)" })
        await AuthService.updateBio(request.server, username, bio || '')
        reply.send({ message: "Bio mise à jour" })
    } catch(err) {
        return reply.code(500).send({ message: err.message })
    }
}

export async function login(request, reply){
    const {username, password} = request.body
    try {
        const token = await AuthService.loginUser(request.server, username, password)
        reply.send({"token": token})
    } catch(err) {
        return reply.code(500).send({message: err.message})
    }
}