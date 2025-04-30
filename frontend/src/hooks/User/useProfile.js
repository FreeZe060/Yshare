import { useState, useEffect } from "react";
import { getProfileById, getPublicProfile } from "../../services/userService";
import { useAuth } from "../../config/authHeader";

function useProfile(userId = null) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessLevel, setAccessLevel] = useState("public");

  const { user: currentUser, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return; 

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = currentUser?.token;

        if (!currentUser?.id) {
          const publicData = await getPublicProfile(userId);
          setProfile(publicData);
          setAccessLevel("public");
        } else if (!userId || Number(userId) === Number(currentUser?.id) || currentUser.role === "Administrateur") {
          const fullData = await getProfileById(userId || currentUser.id, token);
          setProfile(fullData);
          setAccessLevel("private");
        } else {
          const publicData = await getPublicProfile(userId);
          setProfile(publicData);
          setAccessLevel("public");
        }
      } catch (err) {
        setError(err.message || "Erreur lors du chargement du profil.");
      } finally {
        setLoading(false);
      }
    };

    if (userId || currentUser) {
      fetchProfile();
    }
  }, [userId, currentUser, authLoading]);

  return { profile, setProfile, accessLevel, loading, error };
}

export default useProfile;