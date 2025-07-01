import { useState } from 'react';
import { updateEventImage } from '../../services/eventService';

export default function useUpdateEventImage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleUpdateImage = async (imageId, file, token) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await updateEventImage(imageId, file, token);
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { handleUpdateImage, loading, error, success };
}