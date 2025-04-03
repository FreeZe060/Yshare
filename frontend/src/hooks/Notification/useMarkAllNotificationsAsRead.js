import { useState } from "react";
import { markAllNotificationsAsRead } from "../services/notificationService";
import { useAuth } from "../context/AuthContext";

function useMarkAllNotificationsAsRead() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const markAllAsRead = async () => {
		if (!user?.token) throw new Error("Authentification requise");
		setLoading(true);
		setError(null);
		try {
			return await markAllNotificationsAsRead(user.token);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { markAllAsRead, loading, error };
}

export default useMarkAllNotificationsAsRead;