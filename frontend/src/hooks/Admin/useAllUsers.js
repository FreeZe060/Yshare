import { useEffect, useState, useCallback } from 'react';
import { getAllUsers } from '../../services/userService';
import { useAuth } from '../../config/authHeader';

export default function useAllUsers() {
	const { user: authUser } = useAuth();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchUsers = useCallback(async () => {
		try {
			setLoading(true);
			const data = await getAllUsers(authUser?.token);
			setUsers(data);
			setError(null);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [authUser?.token]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	return { users, loading, error, refetch: fetchUsers };
}