import {createEvent, getEvents, getUserEvents, handleJoinEvent} from "../controllers/events.controller.js"

export default async function (server){
    server.post("/createEvent", { preHandler: server.authenticate }, createEvent)
    server.post("/getEvents", { preHandler: server.authenticate }, getEvents)
    server.get("/getUserEvents/:username", { preHandler: server.authenticate }, getUserEvents)
    server.post("/joinEvent", { preHandler: [server.authenticate] }, handleJoinEvent);
}