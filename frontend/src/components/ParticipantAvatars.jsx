import React from 'react';
import useParticipantAvatars from '../hooks/Participant/useParticipantAvatars';

function ParticipantAvatars({ eventId }) {
	const avatars = useParticipantAvatars(eventId);

	return (
		<div className="flex justify-center mb-[20px] -space-x-[20px]">
			{avatars.map((src, index) => (
				<img
					key={index}
					src={src}
					alt={`Avatar ${index}`}
					className="border-[3px] border-white rounded-full w-[40px] h-[40px] object-cover"
				/>
			))}
		</div>
	);
}

export default ParticipantAvatars;