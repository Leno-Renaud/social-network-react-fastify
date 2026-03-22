const BASE_URL = "http://localhost:3000";

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