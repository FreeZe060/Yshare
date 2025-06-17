import { useState } from 'react';
import { updateParticipantMessage } from '../../services/participantService';

function useUpdateMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateMessage = async (eventId, userId, message) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateParticipantMessage(eventId, userId, message);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateMessage, loading, error };
}

export default useUpdateMessage;