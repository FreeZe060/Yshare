import { useState, useEffect } from "react";
import { getAllUsers } from "../services/userService";
import { useAuth } from "../context/AuthContext";

function useAllUsers() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();
  
	useEffect(() => {
	  const fetchUsers = async () => {
		setLoading(true);
		try {
		  const data = await getAllUsers(user?.token);
		  setUsers(data);
		} catch (err) {
		  setError(err.message);
		} finally {
		  setLoading(false);
		}
	  };
	  if (user?.role === "Administrateur") fetchUsers();
	}, [user]);
  
	return { users, loading, error };
}

export default useAllUsers;