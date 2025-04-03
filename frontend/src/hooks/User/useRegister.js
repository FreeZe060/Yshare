import { useState } from "react";
import { registerUser } from "../../services/userService";

export default function useRegister() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	const register = async (userData) => {
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const result = await registerUser(userData);
			setSuccess("Compte créé avec succès");
			return result;
		} catch (err) {
			setError(err.message || "Erreur lors de l'inscription");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { register, loading, error, success };
}