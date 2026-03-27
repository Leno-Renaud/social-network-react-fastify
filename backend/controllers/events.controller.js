import * as EventsService from "../services/events.service.js"

export async function leaveEvent(request, reply){
    const { eventId } = request.params;
    const { username } = request.user;
    try {
        await EventsService.leaveEvent(request.server, eventId, username);
        reply.send({ message: "Événement quitté" });
    } catch(err) {
        reply.code(400).send({ message: err.message });
    }
}

export async function getParticipants(request, reply){
    const { eventId } = request.params;
    try {
        const participants = await EventsService.getParticipants(request.server, eventId);
        reply.send(participants);
    } catch(err) {
        reply.code(500).send({ message: err.message });
    }
}

export async function getMyEvents(request, reply){
    const { username } = request.user
    try {
        const events = await EventsService.getMyEvents(request.server, username)
        reply.send(events)
    } catch(err) {
        return reply.code(500).send({message: err.message})
    }
}

export async function createEvent(request, reply){
        const { username } = request.user
        const { title, type, startDate, description, numberOfPeople, openTo, localization } = request.body
    try {
        await EventsService.createEvent(request.server, username, title, type, startDate, description, numberOfPeople, openTo, localization)
        reply.send({message: "Event created"})
    } catch(err) {
        return reply.code(500).send({message: err.message})
    }
}

export async function getEvents(request, reply){
    //const { username } = request.user
    const { type, date } = request.body
    try {
        const events = await EventsService.getEvents(request.server, type, date)
        reply.send(events)
    } catch(err) {
        return reply.code(500).send({message: err.message})
    }
}

export async function getUserEvents(request, reply){
    //const { username } = request.user
    const { username } = request.params
    try {
        const events = await EventsService.getUserEvents(request.server, username)
        reply.send(events)
    } catch(err) {
        return reply.code(500).send({message: err.message})
    }
}

export async function handleJoinEvent(req, reply) {
    const { eventId } = req.body;
    const { username } = req.user;
    try {
        await EventsService.joinEvent(req.server.pg, eventId, username);
        reply.send({ message: "Joined event successfully" });
    } catch (err) {
        reply.code(500).send({ message: err.message });
    }
}