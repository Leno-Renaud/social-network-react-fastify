import { useState, useEffect } from "react";
import { config, geocoding } from "@maptiler/client";
import styles from "./Geocoding.module.scss";

config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

export default function Search({voyage=false, lieu="", onLocationSelect=() => {}, onLieuSelect=() => {}}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const types = voyage ? ["continental_marine", "country", "major_landform", "region", "subregion", "county", "joint_municipality", "joint_submunicipality", "municipality", "municipal_district","postal_code"] : undefined;

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    onLieuSelect(value);

    if (value.length < 3) return setResults([]);

    const data = await geocoding.forward(value, { limit: 6, language: ["fr"], types: types, excludeTypes: !voyage });
    setResults(data.features || []);
  };

  const handleSelect = (selected) => {
    const [longitude, latitude] = selected.center;
    onLieuSelect(selected.place_name);
    setQuery(selected.place_name);
    setResults([]);

    onLocationSelect({ lat: latitude, lng: longitude });
  };

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        value={lieu}
        onChange={handleChange}
        placeholder="Rechercher une adresse"
        onKeyDown={(e) => { if (e.key === 'Enter') {e.preventDefault(); handleSelect(results[0]) } }}
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