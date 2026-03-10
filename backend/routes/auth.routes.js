import {register, login, me} from "../controllers/auth.controller.js"


export default async function (server){
    server.post("/register", register)
    server.post("/login", login)
    server.get("/me", { preHandler: server.authenticate }, me)
}