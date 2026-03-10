export async function login(username, password) {
  const response = await fetch("http://localhost:8888/login", {
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
  const response = await fetch("http://localhost:8888/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error((await response.json()).message || "Unable to fetch user");
  }

  return response.json();
}

export async function register(username, password) {
    const response = await fetch('http://localhost:8888/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
    }
    return response.json();

}