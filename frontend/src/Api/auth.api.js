const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function login(username, password) {
  console.log("Tentative de login sur :", API_URL + "/login");
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

export async function register(username, password, email, insa) {
  const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, insa })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
    }
    return response.json();

}