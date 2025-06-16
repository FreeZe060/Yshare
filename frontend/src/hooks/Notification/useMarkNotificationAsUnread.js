import { useState } from "react";
import { markNotificationAsUnread } from "../../services/notificationService";
import { useAuth } from "../../config/authHeader";

function useMarkNotificationAsUnread() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const markAsUnread = async (notificationId) => {
		if (!user?.token) throw new Error("Authentification requise");
		setLoading(true);
		setError(null);
		try {
			return await markNotificationAsUnread(notificationId, user.token);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { markAsUnread, loading, error };
}

export default useMarkNotificationAsUnread;