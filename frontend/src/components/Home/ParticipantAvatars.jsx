import React from 'react';
import useParticipantAvatars from '../../hooks/Participant/useParticipantAvatars';
import defaultAvatar from '../../assets/img/default-avatar.jpg';

function ParticipantAvatars({ eventId }) {
	const avatars = useParticipantAvatars(eventId);

	const handleImageError = (e) => {
		e.target.onerror = null;
		e.target.src = defaultAvatar;
	};

	return (
		<div className="flex justify-center -space-x-[20px]">
			{avatars.map((src, index) => (
				<div key={index} className="p-[2px] rounded-full bg-gradient-to-r from-[#580FCA] to-[#F929BB]">
					<img
						src={src}
						alt={`Avatar ${index}`}
						onError={handleImageError}
						className="border-[3px] border-white rounded-full w-[40px] h-[40px] object-cover"
					/>
				</div>
			))}
		</div>
	);
}

export default ParticipantAvatars;
