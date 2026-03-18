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