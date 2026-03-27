import {
    searchMatchingVoyages,
    createMatchingVoyage,
    joinMatchingTravelCompanion,
} from "../controllers/matching.controller.js";

export default async function (server) {
    server.get("/api/matching", searchMatchingVoyages);
    server.post("/api/matching", { preHandler: server.authenticate }, createMatchingVoyage);
    server.post("/api/matching/joinTravelCompanion", { preHandler: server.authenticate }, joinMatchingTravelCompanion);
}
