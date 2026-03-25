import fastify from 'fastify'

import dotenv from 'dotenv';
dotenv.config();

const server = fastify({logger: true})
server.register(import("./plugins/postgres.js"));
server.register(import("./plugins/jwt.js"))
server.register(import("./plugins/cors.js"))
server.register(import("./routes/auth.routes.js"))
server.register(import("./routes/events.routes.js"))
server.register(import("./routes/message.route.js"))
server.register(import("./routes/matching.routes.js"))

server.listen({port: process.env.SERVER_PORT}, (err, addr) => {
    if (err) {
        console.log('Server Error', err)
        process.exit(1)
    }
    console.log(`Server runs on ${addr}`)
})
