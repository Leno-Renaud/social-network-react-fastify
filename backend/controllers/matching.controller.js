import * as MatchingService from "../services/matching.service.js";

export async function searchMatchingVoyages(request, reply) {
    const { lieu, dateDebut, dateFin } = request.query;
    try {
        const profiles = await MatchingService.searchVoyages(request.server, { lieu, dateDebut, dateFin });
        reply.send(profiles);
    } catch (err) {
        return reply.code(500).send({ message: err.message });
    }
}

export async function createMatchingVoyage(request, reply) {
    const { username } = request.user;
    const { lieu, dateDebut, dateFin, bio } = request.body;

    if (!lieu || !dateDebut || !dateFin) {
        return reply.code(400).send({ message: "lieu, dateDebut et dateFin sont requis" });
    }

    try {
        const voyage = await MatchingService.createVoyage(request.server, {
            username,
            lieu,
            dateDebut,
            dateFin,
            bio,
        });
        reply.code(201).send(voyage);
    } catch (err) {
        return reply.code(500).send({ message: err.message });
    }
}

export async function joinMatchingTravelCompanion(request, reply) {
    const { username } = request.user;
    const { voyageId, travelerUsername } = request.body;

    if (!voyageId || !travelerUsername) {
        return reply.code(400).send({ message: "voyageId and travelerUsername are required" });
    }

    if (username === travelerUsername) {
        return reply.code(400).send({ message: "You cannot contact yourself" });
    }

    try {
        const conversation = await MatchingService.joinTravelCompanion(
            request.server,
            username,
            voyageId,
            travelerUsername
        );
        reply.send(conversation);
    } catch (err) {
        return reply.code(500).send({ message: err.message });
    }
}
