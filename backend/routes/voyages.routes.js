import {createVoyage, getVoyages, getUserVoyages} from "../controllers/voyages.controller.js"

export default async function (server){
    server.post("/createVoyage", { preHandler: server.authenticate }, createVoyage)
    server.post("/getVoyages", { preHandler: server.authenticate }, getVoyages)
    server.get("/getUserVoyages/:username", { preHandler: server.authenticate }, getUserVoyages)
}