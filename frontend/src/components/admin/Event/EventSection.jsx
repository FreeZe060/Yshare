import React from 'react';
import SkeletonEventCard from '../../SkeletonLoading/SkeletonEventCard';

import NotFound from '../../../pages/NotFound';

const EventSection = ({
	events,
	loading,
	error,
	currentPage,
	setCurrentPage,
	sortOption,
	setSortOption,
	statusFilter,
	setStatusFilter,
	totalPages,
	onUpdateStatus,
	onDelete,
	Link
}) => {

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
		<div className="et-schedules-tab-container">
			<h1 className="py-4 font-bold text-gray-800 text-2xl uppercase">Tous les événements</h1>
			<div className="flex flex-wrap justify-between items-center gap-3 mb-4">
				<div className="flex items-center gap-3">
					<select
						value={sortOption}
						onChange={(e) => {
							setCurrentPage(1);
							setSortOption(e.target.value);
						}}
						className="shadow-sm px-3 py-1 border rounded text-black text-sm"
					>
						<option value="">Trier par</option>
						<option value="a-z">Nom A → Z</option>
						<option value="date-newest">Date la plus récente</option>
						<option value="date-oldest">Date la plus ancienne</option>
					</select>

					<select
						value={statusFilter}
						onChange={(e) => {
							setCurrentPage(1);
							setStatusFilter(e.target.value);
						}}
						className="shadow-sm px-3 py-1 border rounded text-black text-sm"
					>
						<option value="">Tous les statuts</option>
						<option value="Planifié">Planifié</option>
						<option value="En Cours">En Cours</option>
						<option value="Terminé">Terminé</option>
						<option value="Annulé">Annulé</option>
					</select>
				</div>

				<Link
					to="/create-event"
					className="bg-indigo-600 hover:bg-indigo-700 shadow px-4 py-2 rounded text-white transition"
				>
					<i className="mr-2 fas fa-plus" />
					Ajouter un Événement
				</Link>
			</div>

			<div id="et-event-tab1" className="et-tab active">
				<div className="space-y-[20px] all-scheduled-events">
					{events.map(event => (
						<div
							key={event.id}
							className="flex md:flex-wrap justify-between sm:justify-center gap-x-[20px] gap-y-[15px] rounded-[15px] et-schedule"
						>
							<div className="shadow-md rounded-[15px] w-[220px] h-[182px] overflow-hidden">
								<img
									src={`http://localhost:8080${event.EventImages?.[0]?.image_url || '/default-event.jpg'}`}
									alt="event cover"
									className="w-full h-full object-cover"
								/>
							</div>

							<div className="flex xs:flex-col items-center gap-y-[10px] bg-white shadow-md hover:shadow-lg px-[20px] sm:px-[15px] py-[20px] rounded-[15px] w-full transition duration-300">
								<div className="mr-[25px] xs:mr-0 sm:mr-[15px] pr-[25px] xs:pr-0 sm:pr-[15px] border-[#d9d9d9] border-r xs:border-r-0 min-w-[450px] sm:min-w-0 et-schedule__heading">
									<div className="inline-flex items-center gap-x-[12px] gap-y-[6px] bg-gray-50 mb-[8px] px-[10px] py-[5px] border border-gray-300 rounded-full text-sm animate-fade-in et-schedule-date-time">
										<div className="flex items-center gap-[6px] date">
											<span className="icon">📅</span>
											<span className="text-etGray">
												{new Date(event.start_time).toLocaleDateString('fr-FR')} à {new Date(event.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} -
											</span>
											<span className="text-etGray">
												{new Date(event.end_time).toLocaleDateString('fr-FR')} à {new Date(event.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
											</span>
										</div>
									</div>

									<h3 className="mt-1 mb-1 font-medium text-[18px] text-etBlack sm:text-[16px] hover:text-etBlue leading-tight transition duration-300 et-schedule-title anim-text">
										<a href={`/event/${event.id}`}>{event.title}</a>
									</h3>

									<p className="mb-1 font-semibold text-gray-500 text-xs">
										Organisé par :{" "}
										<Link
											to={`/profile/${event.organizer?.id}`}
											className="text-indigo-600 hover:underline"
										>
											{event.organizer?.name}
										</Link>
									</p>

									<div className="flex items-center gap-[8px] text-etGray text-sm et-schedule-loaction">
										<span className="icon">📍</span>
										<span>{`${event.street_number} ${event.street}, ${event.city} ${event.postal_code || ''}`}</span>
									</div>

									<div className={`text-xs font-semibold px-3 py-1 rounded-full w-fit mt-2
											${event.status === 'Planifié' ? 'bg-blue-100 text-blue-700' : ''}
											${event.status === 'En Cours' ? 'bg-green-100 text-green-700' : ''}
											${event.status === 'Terminé' ? 'bg-gray-200 text-gray-700' : ''}
											${event.status === 'Annulé' ? 'bg-red-100 text-red-700' : ''}
										`}>{event.status}
									</div>
								</div>

								<div className="flex flex-col items-center gap-y-[10px]">
									<div className="flex items-center shrink-0">
										<Link
											to={`/event/${event.id}`}
											className="inline-flex justify-center items-center gap-x-2 hover:bg-etBlue px-4 border border-etBlue rounded-full min-w-[170px] h-[36px] text-etBlue hover:text-white text-sm transition et-btn"
										>
											Modifier l’événement
										</Link>
									</div>

									<div className="flex items-center shrink-0">
										<a
											onClick={() => onUpdateStatus(event.id)}
											className="inline-flex justify-center items-center gap-x-[10px] hover:bg-etBlue px-[12px] border border-etBlue rounded-full min-w-[170px] h-[36px] text-etBlue hover:text-white text-sm hover:scale-105 transition-all duration-300 cursor-pointer et-btn"
										>
											Modifier le statut
										</a>
									</div>

									<div className="flex items-center shrink-0">
										<a
											onClick={() => onDelete(event)}
											className="inline-flex justify-center items-center gap-x-[10px] hover:bg-etBlue px-[12px] border border-etBlue rounded-full h-[36px] text-etBlue hover:text-white text-sm hover:scale-105 transition-all duration-300 cursor-pointer et-btn"
										>
											Supprimer l’événement
										</a>
									</div>
								</div>
							</div>
						</div>
					))}

					<div className="flex justify-center gap-3 mt-6">
						{Array.from({ length: totalPages }, (_, i) => (
							<button
								key={i + 1}
								onClick={() => setCurrentPage(i + 1)}
								className={`w-10 h-10 text-sm rounded-full border transition-all duration-300 ${currentPage === i + 1
									? 'bg-etBlue text-white scale-110 shadow-lg'
									: 'border-etBlue text-etBlue hover:bg-etBlue hover:text-white hover:scale-105'
									}`}
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