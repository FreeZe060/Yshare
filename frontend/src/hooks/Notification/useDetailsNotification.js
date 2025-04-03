import { useState, useEffect } from "react";
import { getNotificationById } from "../services/notificationService";
import { useAuth } from "../context/AuthContext";

function useDetailsNotification(notificationId) {
	const [notification, setNotification] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	useEffect(() => {
		if (!notificationId || !user?.token) return;
		const fetchNotification = async () => {
			setLoading(true);
			try {
				const data = await getNotificationById(notificationId, user.token);
				setNotification(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchNotification();
	}, [notificationId, user?.token]);

	return { notification, loading, error };
}

export default useDetailsNotification;