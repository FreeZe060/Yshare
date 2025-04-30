import { useState } from "react";
import { loginUser } from "../../services/userService";

export default function useLogin() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const login = async ({ email, password }) => {
		setLoading(true);
		setError(null);
		try {
			const result = await loginUser({ email, password });
			return result;
		} catch (err) {
			setError(err.message || "Erreur lors de la connexion");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { login, loading, error };
}