import { useState } from "react";
import { adminCreateUser } from "../services/userService";
import { useAuth } from "../context/AuthContext";

function useAdminCreateUser() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();
  
	const create = async (userData) => {
	  setLoading(true);
	  setError(null);
	  try {
		return await adminCreateUser(userData, user?.token);
	  } catch (err) {
		setError(err.message);
		throw err;
	  } finally {
		setLoading(false);
	  }
	};
  
	return { create, loading, error };
}

export default useAdminCreateUser;