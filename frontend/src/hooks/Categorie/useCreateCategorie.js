import { useState } from "react";
import { createCategorie } from "../../services/categorieService";
import { useAuth } from "../../config/authHeader";

function useCreateCategorie() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const create = async ({ name, parent_id }) => {
		if (!user?.token) {
			throw new Error("Non autorisé : utilisateur non connecté");
		}

		setLoading(true);
		setError(null);
		try {
			const result = await createCategorie({ name, parent_id }, user.token);
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
