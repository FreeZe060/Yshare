import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useEvents from '../../hooks/Events/useEvents';
import SkeletonEventCard from '../SkeletonLoading/SkeletonEventCard';
import usePagination from '../../hooks/Utils/usePagination';

const ITEMS_PER_PAGE = 10;

const EventSection = () => {
	const filters = useMemo(() => ({}), []);
	const [currentPage, setCurrentPage] = useState(1);

	const { events, loading, error } = useEvents(filters, currentPage, ITEMS_PER_PAGE, true);

	const { paginatedItems, totalPages, goToPage } = usePagination(events || [], ITEMS_PER_PAGE);

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
		<div className="et-schedules-tab-container">
			<div id="et-event-tab1" className="et-tab active">
				<div className="all-scheduled-events space-y-[30px]">
					{paginatedItems.map(event => (
						<div key={event.id} className="et-schedule flex md:flex-wrap gap-x-[30px] gap-y-[20px] justify-between rev-slide-up">
							<div className="w-[270px] h-[226px] shadow-[0_4px_60px_rgba(18,96,254,0.12)] shrink-0 rounded-[20px] overflow-hidden">
								<img src={`http://localhost:8080${event.EventImages?.[0]?.image_url || '/default-event.jpg'}`} alt="event cover" />
							</div>

							<div className="px-[37px] sm:px-[22px] py-[30px] shadow-[0_4px_60px_rgba(18,96,254,0.12)] w-full rounded-[20px] flex gap-y-[15px] xs:flex-col items-center xs:items-start">
								<div className="et-schedule__heading pr-[40px] sm:pr-[25px] xs:pr-0 mr-[40px] sm:mr-[25px] xs:mr-0 border-r xs:border-r-0 border-[#d9d9d9]">
									<div className="et-schedule-date-time border border-[rgba(217,217,217,0.89)] py-[7px] px-[15px] rounded-full inline-flex xxs:w-full items-center justify-center gap-x-[24px] gap-y-[10px] mb-[10px] xxs:border-0 xxs:p-0 xxs:justify-start">
										<div className="date flex items-center gap-[10px]">
											<span className="icon">📅</span>
											<span className="text-etGray font-normal text-[16px]">
												{new Date(event.date).toLocaleDateString('fr-FR')}
											</span>
										</div>
										<div className="time flex items-center gap-[10px] xxs:hidden">
											<span className="icon">⏰</span>
											<span className="text-etGray font-normal text-[16px]">
												{event.start_time} – {new Date(event.end_time).toLocaleTimeString('fr-FR')}
											</span>
										</div>
									</div>

									<h3 className="et-schedule-title text-[24px] sm:text-[22px] font-regular text-etBlack leading-[1.25] mb-[16px] anim-text">
										<a href="#" className="hover:text-etBlue">{event.title}</a>
									</h3>

									<div className="et-schedule-loaction flex items-center gap-[12px]">
										<span className="icon">📍</span>
										<h6 className="text-[16px] text-etGray">
											{`${event.street_number} ${event.street}, ${event.city} ${event.postal_code}`}
										</h6>
									</div>
								</div>

								<div className="flex shrink-0 xxl:flex-col flex-wrap items-center xxl:items-start gap-x-[30px] gap-y-[16px]">
									<a href="#" className="et-btn border border-etBlue text-etBlue inline-flex items-center justify-center gap-x-[13px] h-[45px] px-[15px] font-normal text-[17px] rounded-full hover:!bg-etBlue hover:!text-white">Buy Tickets</a>
								</div>
							</div>
						</div>
					))}

					<div className="flex justify-center mt-6 gap-2">
						{Array.from({ length: totalPages }, (_, i) => (
							<button
								key={i + 1}
								onClick={() => {
									setCurrentPage(i + 1);
									goToPage(i + 1);
								}}
								className={`px-4 py-2 rounded-full border ${currentPage === i + 1 ? 'bg-etBlue text-white' : 'border-etBlue text-etBlue'}`}
							>
								{i + 1}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventSection;
