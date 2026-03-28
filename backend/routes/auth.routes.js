import {register, login, me, getProfile, updateBio} from "../controllers/auth.controller.js"


export default async function (server){
    server.post("/register", register)
    server.post("/login", login)
    server.get("/me", { preHandler: server.authenticate }, me)
    server.get("/profile/:username", { preHandler: server.authenticate }, getProfile)
    server.patch("/profile/bio", { preHandler: server.authenticate }, updateBio)
}