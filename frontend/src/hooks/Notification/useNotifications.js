import { useState, useEffect } from "react";
import { getAllNotifications } from "../../services/notificationService";
import { useAuth } from "../../config/authHeader";

function useNotifications() {
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	useEffect(() => {
		if (!user?.token) return;
		const fetchNotifications = async () => {
			setLoading(true);
			try {
				const data = await getAllNotifications(user.token);
				setNotifications(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchNotifications();
	}, [user?.token]);

	return { notifications, loading, error };
}

export default useNotifications;