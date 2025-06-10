import { useState } from "react";
import { deleteComment } from "../../services/commentService";
import { useAuth } from "../../config/authHeader";

function useDeleteComment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const remove = async (commentId) => {
        if (!user?.token) {
            const error = new Error("Authentification requise");
            setError(error.message);
            throw error;
        }

        setLoading(true);
        setError(null);
        try {
            console.log(`[useDeleteComment] Suppression du commentaire ${commentId}`);
            const result = await deleteComment(commentId, user.token);
            console.log(`[useDeleteComment] Commentaire ${commentId} supprimé avec succès`);
            return result;
        } catch (err) {
            console.error(`[useDeleteComment] Erreur lors de la suppression du commentaire ${commentId}:`, err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { remove, loading, error };
}

export default useDeleteComment;