import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useEvents from '../../../hooks/Events/useEvents';
import SkeletonEventCard from '../../SkeletonLoading/SkeletonEventCard';

const LastEventSection = () => {
	const filters = useMemo(() => ({}), []);
	const { events, loading, error } = useEvents(filters, 1, 5);

	if (loading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonEventCard key={i} />
                ))}
            </div>
        );
    }
	if (error) return <p className="text-red-500">Erreur : {error}</p>;

	return (
		<div id="last-events">
			<h1 className="font-bold py-4 uppercase text-gray-800 text-xl sm:text-2xl">Last 4 Events</h1>

			<div className="grid grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
				{events.map(event => {
					const image = event?.EventImages?.[0]?.image_url;
					const date = new Date(event.start_time).toLocaleDateString();

					return (
						<div key={event.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 text-sm sm:text-base">
							<div className="flex flex-col h-full">
								<img
									src={`http://localhost:8080${image || '/default-event.jpg'}`}
									alt={event.title}
									className="w-full h-36 sm:h-40 object-cover rounded-t-lg"
								/>

								<div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
									<div className="min-h-[48px] sm:min-h-[56px]">
										<p className="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-2">
											{event.title}
										</p>
									</div>
									<p className="text-gray-500 text-xs sm:text-sm mt-1">📅 {date}</p>
									<p className="text-gray-400 text-xs sm:text-sm mt-1">👤 Organisé par {event.organizer?.name || `ID ${event.id_org}`}</p>
								</div>

								<div className="border-t border-gray-100 p-3 sm:p-4">
									<Link
										to={`/event/${event.id}`}
										className="inline-flex space-x-2 items-center text-indigo-600 hover:text-indigo-800 transition text-sm"
									>
										<i className="fas fa-info-circle"></i>
										<span>Voir</span>
									</Link>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default LastEventSection;