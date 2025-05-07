import { useState, useCallback } from 'react';
import { addReaction } from '../../services/commentService';
import { useAuth } from '../../config/authHeader';

export function useAddReaction() {
	const { user } = useAuth(); 
	const token = user?.token;

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const add = useCallback(async (commentId, emoji) => {
		if (!token) throw new Error("Utilisateur non authentifié.");
		if (!commentId || !emoji) throw new Error("Paramètres requis manquants (commentId ou emoji).");

		setLoading(true);
		setError(null);

		try {
			return await addReaction(commentId, emoji, token);
		} catch (err) {
			setError(err);
			throw err;
		} finally {
			setLoading(false);
		}
	}, [token]);

	return { addReaction: add, loading, error };
}