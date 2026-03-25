const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function createVoyage(title, startDate, endDate, description, lieu) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/createVoyage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({title, startDate, endDate, description, lieu}),
  });
  if (!response.ok) {
    throw new Error((await response.json()).message || "Unable to create voyage");
  }
  return response.json();
}

export async function getVoyages(type, date) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/getVoyages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ type, date }),
  });
  if (!response.ok) {
    throw new Error((await response.json()).message || "Unable to fetch voyages");
  }
  return response.json();
}

export async function getUserVoyages(username) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/getUserVoyages/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  if (!response.ok) {
    throw new Error((await response.json()).message || "Unable to fetch user voyages");
  }
  return response.json();
}