import { useCallback } from 'react';
import { updateUserStatus } from '../../services/userService';

function useUpdateUserStatus(token) {
	return useCallback((userId, status) => {
		return updateUserStatus(userId, status, token);
	}, [token]);
}

export default useUpdateUserStatus;