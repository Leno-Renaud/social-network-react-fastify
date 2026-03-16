import {createEvent, getEvents} from "../controllers/events.controller.js"

export default async function (server){
    server.post("/createEvent", { preHandler: server.authenticate }, createEvent)
    server.post("/getEvents", { preHandler: server.authenticate }, getEvents)
}