export const getMessages = async (req, reply) => {
  return getMessagesService(req.params.id);
};

export const sendMessage = async (req, reply) => {
  return sendMessageService(req.body);
};