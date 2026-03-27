import fp from "fastify-plugin";
import { Server as SocketIOServer } from "socket.io";

export default fp(async function socketPlugin(server) {
  server.decorate("io", null);

  server.addHook("onReady", async () => {
    const io = new SocketIOServer(server.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.use(async (socket, next) => {
      try {
        const authHeader = socket.handshake.headers?.authorization;
        const tokenFromHeader = authHeader?.startsWith("Bearer ")
          ? authHeader.slice(7)
          : null;
        const token = socket.handshake.auth?.token || tokenFromHeader;

        if (!token) {
          return next(new Error("Missing auth token"));
        }

        const user = await server.jwt.verify(token);
        socket.user = user;
        return next();
      } catch (error) {
        return next(new Error("Invalid auth token"));
      }
    });

    io.on("connection", (socket) => {
      const username = socket.user?.username;
      if (username) {
        socket.join(`user:${username}`);
      }

      socket.on("conversation:join", (eventId) => {
        if (!eventId) return;
        socket.join(`conversation:${eventId}`);
      });

      socket.on("conversation:leave", (eventId) => {
        if (!eventId) return;
        socket.leave(`conversation:${eventId}`);
      });
    });

    server.io = io;
  });

  server.addHook("onClose", async () => {
    await server.io?.close();
  });
});