import { useState, useEffect, useCallback } from "react";
import { getAllCategories } from "../../services/categorieService";

function useCategories() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchCategories = useCallback(async () => {
		setLoading(true);
		try {
			const data = await getAllCategories();
			setCategories(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	return { categories, loading, error, refetch: fetchCategories };
}

export default useCategories;