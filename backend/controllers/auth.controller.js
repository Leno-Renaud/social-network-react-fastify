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
    const {username, password, email, insa} = request.body
    try {
        await AuthService.registerUser(request.server, username, password, email, insa)
        reply.send({message: "User created"})
    } catch(err) {
        return reply.code(500).send({message: err.message})
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