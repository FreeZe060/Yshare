import { useState } from "react";
import { updateProfile } from "../../services/userService";
import { useAuth } from "../../config/authHeader";

function useUpdateProfile() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const update = async (userData, userId = null) => {
		setLoading(true);
		setError(null);
		try {
			const token = user?.token;
			return await updateProfile(userData, token, userId);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { update, loading, error };
}

export default useUpdateProfile;