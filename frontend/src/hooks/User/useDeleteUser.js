import { useState } from "react";
import { deleteUser } from "../services/userService";
import { useAuth } from "../config/authHeader"; 

function useDeleteUser() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();
  
	const removeUser = async (userId) => {
	  setLoading(true);
	  setError(null);
	  try {
		return await deleteUser(userId, user?.token);
	  } catch (err) {
		setError(err.message);
		throw err;
	  } finally {
		setLoading(false);
	  }
	};
  
	return { removeUser, loading, error };
}

export default useDeleteUser;   