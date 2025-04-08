import { useState, useEffect } from "react";
import { getAllCategories } from "../../services/categorieService";

function useCategories() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchCategories = async () => {
			setLoading(true);
			try {
				const data = await getAllCategories(); 
				setCategories(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []); 

	return { categories, loading, error };
}

export default useCategories;
