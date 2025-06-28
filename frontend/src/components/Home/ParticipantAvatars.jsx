import React from 'react';
import useParticipantAvatars from '../../hooks/Participant/useParticipantAvatars';

function ParticipantAvatars({ eventId }) {
	const avatars = useParticipantAvatars(eventId);
	
	return (
		<div className="flex justify-center -space-x-[20px]">
			{avatars.map((src, index) => (
				<div className="p-[2px] rounded-full bg-gradient-to-r from-[#580FCA] to-[#F929BB]">
					<img
						key={index}
						src={src}
						alt={`Avatar ${index}`}
						className="border-[3px] border-white rounded-full w-[40px] h-[40px] object-cover"
					/>
			  </div>
				
			))}
		</div>
	);
}

export default ParticipantAvatars;