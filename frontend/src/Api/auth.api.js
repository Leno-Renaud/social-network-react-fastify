const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function login(username, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error((await response.json()).message);
  const data = await response.json();
  return data;
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error((await response.json()).message || "Unable to fetch user");
  }

  return response.json();
}

export async function getUserProfile(username) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/profile/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error((await response.json()).message);
  return response.json();
}

export async function updateBio(bio) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/profile/bio`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ bio }),
  });
  if (!response.ok) throw new Error((await response.json()).message);
  return response.json();
}

export async function register(username, password, insa, email) {
  const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, insa, email })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
    }
    return response.json();

}