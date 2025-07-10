import React from 'react';
import SkeletonEventCard from '../../SkeletonLoading/SkeletonEventCard';
import NotFound from '../../../pages/NotFound';

const LastEventSection = ({ events, loading, error, Link }) => {

	if (loading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonEventCard key={i} />
                ))}
            </div>
        );
    }
	if (error) return <NotFound/>;

	return (
		<div id="last-events">
			<h1 className="py-4 font-bold text-gray-800 text-xl sm:text-2xl uppercase">Last 4 Events</h1>

			<div className="gap-4 grid grid-cols-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				{events.map(event => {
					const image = event?.EventImages?.[0]?.image_url;
					const date = new Date(event.start_time).toLocaleDateString();

					return (
						<div key={event.id} className="bg-white shadow-md hover:shadow-lg rounded-lg text-sm sm:text-base transition duration-200">
							<div className="flex flex-col h-full">
								<img
									src={`${image || '/default-event.jpg'}`}
									alt={event.title}
									className="rounded-t-lg w-full h-36 sm:h-40 object-cover"
								/>

								<div className="flex flex-col flex-1 justify-between p-3 sm:p-4">
									<div className="min-h-[48px] sm:min-h-[56px]">
										<p className="font-bold text-gray-900 text-base sm:text-lg line-clamp-2 leading-snug">
											{event.title}
										</p>
									</div>
									<p className="mt-1 text-gray-500 text-xs sm:text-sm">📅 {date}</p>
									<p className="mt-1 text-gray-400 text-xs sm:text-sm">👤 Organisé par {event.organizer?.name || `ID ${event.id_org}`}</p>
								</div>

								<div className="p-3 sm:p-4 border-gray-100 border-t">
									<Link
										to={`/event/${event.id}`}
										className="inline-flex items-center space-x-2 text-[#C72EBF] hover:text-[#8318C7] text-sm transition"
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