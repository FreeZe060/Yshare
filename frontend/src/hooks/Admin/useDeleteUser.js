import { useCallback } from 'react';
import { deleteUser } from '../../services/userService';

function useDeleteUser(token) {
	const removeUser = useCallback(async (userId) => {
		await deleteUser(userId, token);
	}, [token]);

	return removeUser;
}

export default useDeleteUser;