export async function createEvent(title, type, startDate, description, numberOfPeople, openTo, localization) {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:8888/createEvent", {
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
  const response = await fetch("http://localhost:8888/getEvents", {
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