import * as EventsService from "../services/events.service.js"

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
    const { type, date } = request.body
    const { username } = request.user
    try {
        const userRes = await request.server.pg.query("SELECT insa FROM users WHERE username=$1", [username])
        const insaPrefix = userRes.rows[0]?.insa?.split('-')[0] || null
        const events = await EventsService.getEvents(request.server, type, date, insaPrefix)
        reply.send(events)
    } catch(err) {
        return reply.code(500).send({message: err.message})
    }
}

export async function getUserEvents(request, reply){
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