import fp from "fastify-plugin"
import jwt from "@fastify/jwt"

export default fp(async function(server){
    await server.register(jwt, {secret: process.env.JWT_SECRET})

    server.decorate("authenticate", async(request, reply)=>{
        try{
            await request.jwtVerify()
        }
        catch(err){
            reply.code(401).send(err)
        }
    })
})