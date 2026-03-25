import { searchVoyages, createVoyage } from "../services/matching.service.js";

export default async function (server) {
    // Rechercher des profils par destination et dates
    server.get("/api/matching", async (request, reply) => {
        const { lieu, dateDebut, dateFin } = request.query;
        try {
            const profiles = await searchVoyages(server, { lieu, dateDebut, dateFin });
            reply.send(profiles);
        } catch (err) {
            reply.code(500).send({ message: err.message });
        }
    });

    // Publier son plan de voyage (authentifié)
    server.post("/api/matching", { preHandler: server.authenticate }, async (request, reply) => {
        const { username } = request.user;
        const { lieu, dateDebut, dateFin, bio } = request.body;
        if (!lieu || !dateDebut || !dateFin) {
            return reply.code(400).send({ message: "lieu, dateDebut et dateFin sont requis" });
        }
        try {
            const voyage = await createVoyage(server, { username, lieu, dateDebut, dateFin, bio });
            reply.code(201).send(voyage);
        } catch (err) {
            reply.code(500).send({ message: err.message });
        }
    });
}
