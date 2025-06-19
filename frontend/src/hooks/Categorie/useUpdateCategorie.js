import { useState } from "react";
import { updateCategorie } from "../../services/categorieService";
import { useAuth } from "../../config/authHeader";

function useUpdateCategorie() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const update = async (id, { name, parent_id }) => {
		if (!user?.token) {
			throw new Error("Non autorisé : utilisateur non connecté");
		}

		setLoading(true);
		setError(null);
		try {
			const result = await updateCategorie(id, { name, parent_id }, user.token);
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { update, loading, error };
}

export default useUpdateCategorie;
