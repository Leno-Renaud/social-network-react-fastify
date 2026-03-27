import * as VoyagesService from "../services/voyages.service.js"

export async function createVoyage(request, reply){
        const { username } = request.user
        const { title, startDate, endDate, description, lieu } = request.body
    try {
        await VoyagesService.createVoyage(request.server, username, title, startDate, endDate, description, lieu)
        reply.send({message: "Voyage created"})
    } catch(err) {
        return reply.code(500).send({message: err.message})
    }
}

export async function getVoyages(request, reply){
    const { startDate, endDate, lieu } = request.body

    if (!startDate || !endDate) {
        return reply.code(400).send({ message: "startDate et endDate sont requis" })
    }

    if (!lieu || !lieu.trim()) {
        return reply.code(400).send({ message: "lieu est requis" })
    }

    try {
        const voyages = await VoyagesService.getVoyages(request.server, startDate, endDate, lieu.trim())
        reply.send(voyages)
    } catch(err) {
        return reply.code(500).send({message: err.message})
    }
}

export async function getUserVoyages(request, reply){
    //const { username } = request.user
    const { username } = request.params
    try {
        const voyages = await VoyagesService.getUserVoyages(request.server, username)
        reply.send(voyages)
    } catch(err) {
        return reply.code(500).send({message: err.message})
    }
}