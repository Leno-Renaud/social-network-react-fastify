import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { INSA_STRUCTURE } from "../Data/insaData";
import { getUserProfile, updateBio } from "../Api/auth.api";
import styles from "./Profile.module.scss";

export default function Profile() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { username: routeUsername } = useParams();

  const profileUsername = routeUsername || user?.username;
  const isOwnProfile = !routeUsername || routeUsername === user?.username;

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [bioSaving, setBioSaving] = useState(false);
  const [bioError, setBioError] = useState('');

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!profileUsername || loading) return;
    setProfileLoading(true);
    getUserProfile(profileUsername)
      .then(data => {
        setProfile(data.profile);
        setBioInput(data.profile.bio || '');
      })
      .catch(err => { console.error('Profile fetch error:', err); setProfile(null); })
      .finally(() => setProfileLoading(false));
  }, [profileUsername, loading]);

  const [insaId, depId] = (profile?.insa || '').split('-');
  const insaObj = INSA_STRUCTURE.find(i => i.id === insaId);
  const insaName = insaObj?.name;
  const depName = insaObj?.deps.find(d => d.id === depId)?.label;

  async function saveBio() {
    setBioSaving(true);
    setBioError('');
    try {
      await updateBio(bioInput);
      setProfile(p => ({ ...p, bio: bioInput }));
      setEditingBio(false);
    } catch(err) {
      setBioError(err.message);
    } finally {
      setBioSaving(false);
    }
  }

  if (loading || profileLoading) {
    return <div className={styles.container}><p>Chargement...</p></div>;
  }

  if (!profile) {
    return <div className={styles.container}><p>Utilisateur introuvable.</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {profileUsername.charAt(0).toUpperCase()}
          </div>
          <div className={styles.details}>
            <h1>{isOwnProfile ? "Mon Profil" : profileUsername}</h1>
            {isOwnProfile && user?.email && <p><span>✉️</span> {user.email}</p>}
            {insaName && <p><span>🎓</span> {insaName}{depName ? ` — ${depName}` : ''}</p>}
          </div>
        </div>
      </div>

      <div className={styles.bioSection}>
        <div className={styles.bioHeader}>
          <h3>À propos</h3>
          {isOwnProfile && !editingBio && (
            <button className={styles.editBtn} onClick={() => setEditingBio(true)}>
              ✏️ {profile.bio ? 'Modifier' : 'Ajouter une bio'}
            </button>
          )}
        </div>

        {editingBio ? (
          <div className={styles.bioEdit}>
            <textarea
              value={bioInput}
              onChange={e => setBioInput(e.target.value)}
              maxLength={300}
              placeholder="Parle-toi en quelques mots..."
              className={styles.bioTextarea}
              autoFocus
            />
            <div className={styles.bioMeta}>
              <span className={styles.charCount}>{bioInput.length}/300</span>
              {bioError && <span className={styles.bioError}>{bioError}</span>}
            </div>
            <div className={styles.bioActions}>
              <button className={styles.cancelBtn} onClick={() => { setEditingBio(false); setBioInput(profile.bio || ''); }}>
                Annuler
              </button>
              <button className={styles.saveBtn} onClick={saveBio} disabled={bioSaving}>
                {bioSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        ) : (
          <p className={styles.bioText}>
            {profile.bio || (isOwnProfile ? <em>Ajoute une description pour te présenter !</em> : <em>Aucune description.</em>)}
          </p>
        )}
      </div>
    </div>
  );
}
