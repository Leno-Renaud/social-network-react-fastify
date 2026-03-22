fastify.get('/messages/:id', getMessages);
fastify.post('/messages', sendMessage);