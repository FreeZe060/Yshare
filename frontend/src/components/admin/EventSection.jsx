import React, { useMemo, useState, useEffect } from 'react';
import useEvents from '../../hooks/Events/useEvents';
import SkeletonEventCard from '../SkeletonLoading/SkeletonEventCard';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../config/authHeader';
import useUpdateEventStatus from '../../hooks/Events/useUpdateEventStatus';

const ITEMS_PER_PAGE = 6;

const EventSection = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [sortOption, setSortOption] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const { user } = useAuth();
	const { updateStatus } = useUpdateEventStatus();

	const filters = useMemo(() => {
		const f = {};
		if (statusFilter) f.status = statusFilter;
		if (sortOption === 'a-z') f.sort = 'title_asc';
		else if (sortOption === 'date-newest') f.sort = 'start_time_desc';
		else if (sortOption === 'date-oldest') f.sort = 'start_time_asc';
		return f;
	}, [statusFilter, sortOption]);

	const { events, total, loading, error } = useEvents(filters, currentPage, ITEMS_PER_PAGE, true);
	const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, [currentPage]);

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
			<h1 className="text-2xl font-bold py-4 uppercase text-gray-800">Tous les événements</h1>
			<div className="flex flex-wrap justify-between items-center gap-3 mb-4">
				<div className="flex gap-3 items-center">
					<select
						value={sortOption}
						onChange={(e) => {
							setCurrentPage(1);
							setSortOption(e.target.value);
						}}
						className="border rounded px-3 py-1 text-sm text-black shadow-sm"
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
						className="border rounded px-3 py-1 text-sm text-black shadow-sm"
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
					className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition"
				>
					<i className="fas fa-plus mr-2" />
					Ajouter un Événement
				</Link>
			</div>

			<div id="et-event-tab1" className="et-tab active">
				<div className="all-scheduled-events space-y-[20px]">
					{events.map(event => (
						<div
							key={event.id}
							className="et-schedule flex md:flex-wrap gap-x-[20px] gap-y-[15px] justify-between sm:justify-center rounded-[15px]"
						>
							<div className="w-[220px] h-[182px] rounded-[15px] overflow-hidden shadow-md">
								<img
									src={`http://localhost:8080${event.EventImages?.[0]?.image_url || '/default-event.jpg'}`}
									alt="event cover"
									className="object-cover w-full h-full"
								/>
							</div>

							<div className="px-[20px] sm:px-[15px] py-[20px] shadow-md w-full rounded-[15px] flex gap-y-[10px] xs:flex-col items-center bg-white transition duration-300 hover:shadow-lg">
								<div className="et-schedule__heading pr-[25px] sm:pr-[15px] min-w-[450px] sm:min-w-0 xs:pr-0 mr-[25px] sm:mr-[15px] xs:mr-0 border-r xs:border-r-0 border-[#d9d9d9]">
									<div className="et-schedule-date-time border border-gray-300 py-[5px] px-[10px] rounded-full inline-flex items-center gap-x-[12px] gap-y-[6px] mb-[8px] text-sm bg-gray-50 animate-fade-in">
										<div className="date flex items-center gap-[6px]">
											<span className="icon">📅</span>
											<span className="text-etGray">
												{new Date(event.start_time).toLocaleDateString('fr-FR')} à {new Date(event.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} -
											</span>
											<span className="text-etGray">
												{new Date(event.end_time).toLocaleDateString('fr-FR')} à {new Date(event.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
											</span>
										</div>
									</div>

									<h3 className="et-schedule-title text-[18px] sm:text-[16px] font-medium text-etBlack leading-tight mb-1 mt-1 anim-text transition duration-300 hover:text-etBlue">
										<a href="#">{event.title}</a>
									</h3>

									<p className="text-xs text-gray-500 font-semibold mb-1">Organisé par : {event.organizer?.name}</p>

									<div className="et-schedule-loaction flex items-center gap-[8px] text-sm text-etGray">
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

								<div className="flex flex-col gap-y-[10px] items-center">
									<div className="flex shrink-0 items-center">
										<Link
											to={`/event/${event.id}`}
											className="et-btn border border-etBlue text-etBlue inline-flex items-center justify-center gap-x-2 h-[36px] px-4 text-sm rounded-full transition hover:bg-etBlue hover:text-white"
										>
											Modifier l’événement
										</Link>
									</div>

									<div className="flex shrink-0 items-center">
										<a
											onClick={async () => {
												const { value: newStatus } = await Swal.fire({
													title: 'Modifier le statut de l’événement',
													input: 'select',
													inputOptions: {
														Planifié: 'Planifié',
														'En Cours': 'En Cours',
														Terminé: 'Terminé',
														Annulé: 'Annulé',
													},
													inputPlaceholder: 'Choisir un statut',
													showCancelButton: true,
													confirmButtonText: 'Mettre à jour',
													cancelButtonText: 'Annuler',
													confirmButtonColor: '#2563eb',
													inputValidator: value => {
														if (!value) {
															return 'Vous devez sélectionner un statut';
														}
													}
												});

												if (newStatus) {
													try {
														await updateStatus(event.id, newStatus, user?.token);
														Swal.fire({
															icon: 'success',
															title: 'Statut mis à jour !',
															text: `Le statut de l’événement est maintenant "${newStatus}"`,
															timer: 2000,
															showConfirmButton: false,
														});
														window.location.reload();
													} catch (error) {
														Swal.fire({
															icon: 'error',
															title: 'Erreur',
															text: error.message,
														});
													}
												}
											}}
											className="et-btn border cursor-pointer border-etBlue text-etBlue inline-flex items-center justify-center gap-x-[10px] h-[36px] px-[12px] text-sm rounded-full transition-all duration-300 hover:bg-etBlue hover:text-white hover:scale-105"
										>
											Modifier le statut
										</a>
									</div>
								</div>
							</div>
						</div>
					))}

					<div className="flex justify-center mt-6 gap-3">
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
