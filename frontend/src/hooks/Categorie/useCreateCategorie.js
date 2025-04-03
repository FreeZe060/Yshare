import { useState } from "react";
import { createCategorie } from "../services/categorieService";
import { useAuth } from "../context/AuthContext";

function useCreateCategorie() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const create = async (name) => {
		if (!user?.token) {
			throw new Error("Non autorisé : utilisateur non connecté");
		}

		setLoading(true);
		setError(null);
		try {
			const result = await createCategorie(name, user.token);
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { create, loading, error };
}

export default useCreateCategorie;
