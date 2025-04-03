import { useState } from "react";
import { deleteCategorie } from "../services/categorieService";
import { useAuth } from "../context/AuthContext";

function useDeleteCategorie() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const remove = async (id) => {
		if (!user?.token) {
			throw new Error("Non autorisé : utilisateur non connecté");
		}

		setLoading(true);
		setError(null);
		try {
			const result = await deleteCategorie(id, user.token);
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { remove, loading, error };
}

export default useDeleteCategorie;
