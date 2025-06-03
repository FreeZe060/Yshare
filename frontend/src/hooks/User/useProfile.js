import { useState, useEffect } from "react";
import { getProfileById } from "../../services/userService";
import { useAuth } from "../../config/authHeader";

function useProfile(userId = null) {
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [accessLevel, setAccessLevel] = useState("public");
	const [isAdmin, setIsAdmin] = useState(false);
	const [isOwner, setIsOwner] = useState(false);

	const { user: currentUser, loading: authLoading } = useAuth();

	useEffect(() => {
		if (authLoading) return;

		const fetchProfile = async () => {
			setLoading(true);
			try {
				const token = currentUser?.token || null;
				const targetId = userId || currentUser?.id;

				if (!targetId) {
					setError("Aucun identifiant utilisateur fourni.");
					return;
				}

				const data = await getProfileById(targetId, token);
				setProfile(data);

				const isCurrentUser = currentUser && Number(currentUser.id) === Number(targetId);
				const isUserAdmin = currentUser?.role === "Administrateur";

				setIsOwner(isCurrentUser);
				setIsAdmin(isUserAdmin);
				setAccessLevel(isCurrentUser || isUserAdmin ? "private" : "public");

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

	return { profile, setProfile, accessLevel, isAdmin, isOwner, loading, error };
}

export default useProfile;