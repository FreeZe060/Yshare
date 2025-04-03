import { useState } from "react";
import { markNotificationAsRead } from "../services/notificationService";
import { useAuth } from "../context/AuthContext";

function useMarkNotificationAsRead() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const markAsRead = async (notificationId) => {
		if (!user?.token) throw new Error("Authentification requise");
		setLoading(true);
		setError(null);
		try {
			return await markNotificationAsRead(notificationId, user.token);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { markAsRead, loading, error };
}

export default useMarkNotificationAsRead;