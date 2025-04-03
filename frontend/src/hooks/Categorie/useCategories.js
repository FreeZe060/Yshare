import { useState, useEffect } from "react";
import { getAllCategories } from "../../services/categorieService";
import { useAuth } from "../../context/AuthContext";

function useCategories() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	useEffect(() => {
		const fetchCategories = async () => {
			if (!user?.token) return; 

			setLoading(true);
			try {
				const data = await getAllCategories(user.token);
				setCategories(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, [user]);

	return { categories, loading, error };
}

export default useCategories;
