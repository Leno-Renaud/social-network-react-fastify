import {createEvent, getEvents, getUserEvents, handleJoinEvent, getMyEvents, leaveEvent, getParticipants} from "../controllers/events.controller.js"

export default async function (server){
    server.post("/createEvent", { preHandler: server.authenticate }, createEvent)
    server.post("/getEvents", { preHandler: server.authenticate }, getEvents)
    server.get("/getUserEvents/:username", { preHandler: server.authenticate }, getUserEvents)
    server.post("/joinEvent", { preHandler: [server.authenticate] }, handleJoinEvent);
    server.get("/myEvents", { preHandler: server.authenticate }, getMyEvents);
    server.delete("/leaveEvent/:eventId", { preHandler: server.authenticate }, leaveEvent);
    server.get("/eventParticipants/:eventId", { preHandler: server.authenticate }, getParticipants);
}