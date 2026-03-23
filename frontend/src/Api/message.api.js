const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function getConversations() {
	const token = localStorage.getItem("token");
	const response = await fetch(`${API_URL}/conversations`, {
		headers: { Authorization: `Bearer ${token}` },
	});
    if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status}`);
    }
	return response.json();
}

export async function getConversationMessages(conversationId) {
	const token = localStorage.getItem("token");
	const response = await fetch(`${API_URL}/message/${conversationId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
    if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status}`);
    }
	return response.json();
}

export async function sendMessage(eventId, message) {
	const token = localStorage.getItem("token");
	const response = await fetch(`${API_URL}/message`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ eventId, message }),
	});
    if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status}`);
    }
	return response.json();
}