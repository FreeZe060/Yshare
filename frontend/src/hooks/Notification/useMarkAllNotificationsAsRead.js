import { useState } from "react";
import { markAllNotificationsAsRead } from "../../services/notificationService";
import { useAuth } from "../../config/authHeader";

function useMarkAllNotificationsAsRead() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const markAllAsRead = async () => {
		if (!user?.token) throw new Error("Authentification requise");
		setLoading(true);
		setError(null);
		try {
			await markAllNotificationsAsRead(user.token);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updateLocalNotifications = (setLocalNotifications) => {
		setLocalNotifications((prev) =>
			prev.map((n) => ({ ...n, read_status: true }))
		);
	};

	return { markAllAsRead, updateLocalNotifications, loading, error };
}

export default useMarkAllNotificationsAsRead;