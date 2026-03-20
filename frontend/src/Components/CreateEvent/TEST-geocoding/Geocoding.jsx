import { useState } from "react";
import { config, geocoding } from "@maptiler/client";
import styles from "./Geocoding.module.scss";

config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

export default function Search({onLocationSelect}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 3) return setResults([]);

    const data = await geocoding.forward(value, { limit: 6, language: ["fr"] });
    setResults(data.features || []);
  };

  const handleSelect = (selected) => {
    const [longitude, latitude] = selected.center;
    setQuery(selected.place_name);
    setResults([]);
    //alert(`Coordonnees GPS:\nLongitude: ${longitude}\nLatitude: ${latitude}`);
    onLocationSelect({ lat: latitude, lng: longitude });
  };

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        value={query}
        onChange={handleChange}
        placeholder="Rechercher une adresse"
      />

      {results.length > 0 && (
        <ul className={styles.dropdown}>
          {results.map((r) => (
            <li key={r.id}>
              <button type="button" className={styles.option} onClick={() => handleSelect(r)}>
                {r.place_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}