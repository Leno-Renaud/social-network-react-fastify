const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getMatchingProfiles = async (filters) => {
  const params = new URLSearchParams();

  if (filters.lieu) params.append("lieu", filters.lieu);
  if (filters.dateDebut) params.append("dateDebut", filters.dateDebut);
  if (filters.dateFin) params.append("dateFin", filters.dateFin);

  const response = await fetch(`${BASE_URL}/api/matching?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Erreur serveur : ${response.status}`);
  }

  return response.json();
};

export const joinTravelCompanion = async (voyageId, travelerUsername) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/api/matching/joinTravelCompanion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ voyageId, travelerUsername }),
  });

  if (!response.ok) {
    throw new Error((await response.json()).message || `Erreur serveur : ${response.status}`);
  }

  return response.json();
};