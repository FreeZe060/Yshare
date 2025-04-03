import { useState, useEffect } from "react";
import { getProfile, getProfileById } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

function useProfile(userId = null) {
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();
  
	useEffect(() => {
	  const fetchProfile = async () => {
		setLoading(true);
		try {
		  const token = user?.token;
		  const data = userId
			? await getProfileById(userId, token)
			: await getProfile(token);
		  setProfile(data);
		} catch (err) {
		  setError(err.message);
		} finally {
		  setLoading(false);
		}
	  };
	  if (user) fetchProfile();
	}, [user, userId]);
  
	return { profile, loading, error };
}

export default useProfile;
