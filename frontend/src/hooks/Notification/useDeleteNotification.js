import { useState } from "react";
import { deleteNotification } from "../../services/notificationService";
import { useAuth } from "../../config/authHeader";

function useDeleteNotification() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const removeNotification = async (notificationId) => {
		if (!user?.token) throw new Error("Authentification requise");
		setLoading(true);
		setError(null);
		try {
			return await deleteNotification(notificationId, user.token);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { removeNotification, loading, error };
}

export default useDeleteNotification;