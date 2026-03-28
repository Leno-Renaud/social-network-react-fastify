const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function createEvent(title, type, startDate, description, numberOfPeople, openTo, localization) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/createEvent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({title, type, startDate, description, numberOfPeople, openTo, localization}),
  });
  if (!response.ok) {
    throw new Error((await response.json()).message || "Unable to create event");
  }
  return response.json();
}

export async function getEvents(type, date) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/getEvents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ type, date }),
  });
  if (!response.ok) {
    throw new Error((await response.json()).message || "Unable to fetch events");
  }
  return response.json();
}

export async function getUserEvents(username) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/getUserEvents/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  if (!response.ok) {
    throw new Error((await response.json()).message || "Unable to fetch user events");
  }
  return response.json();
}

export async function joinEvent(eventId) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/joinEvent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ eventId }),
  });

  if (!response.ok) {
    throw new Error((await response.json()).message || "Unable to join event");
  }

  return response.json();
}