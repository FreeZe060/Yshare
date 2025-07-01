import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import '../../assets/css/style.css';
import useSlideUpAnimation from '../../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../../hooks/Animations/useTextAnimation';

import SkeletonEventCard from '../SkeletonLoading/SkeletonEventCard';
import vector1 from "../../assets/img/et-3-event-vector.svg";
import vector2 from "../../assets/img/et-3-event-vector-2.svg";

import FiltreParticipant from '../Participant/FiltreParticipant';
import CardEvent from '../Events/CardEvent';

function Favoris({
	API_BASE_URL,
	user,
	favoris,
	loading,
	toggleFavoris,
	statusFilter,
	setStatusFilter,
	eventFilter,
	setEventFilter,
	searchValue,
	setSearchValue,
	suggestions,
	onSuggestionsFetchRequested,
	onSuggestionsClearRequested,
	statuses,
	events,
	inputProps
}) {
	useSlideUpAnimation('.rev-slide-up', favoris);
	useTextAnimation();

	const showToast = (title, icon = 'success') => {
		Swal.fire({
			toast: true,
			position: 'bottom-end',
			icon,
			title,
			showConfirmButton: false,
			timer: 3000,
			timerProgressBar: true,
			background: '#fff',
			color: '#333',
			customClass: {
				popup: 'shadow-lg rounded-lg animate__animated animate__fadeInUp'
			}
		});
	};

	const isFavoris = (eventId) => favoris.some((f) => f.id_event === eventId);

	return (
		<section className="z-[1] relative py-[120px] md:py-[60px] xl:py-[80px] min-h-[60rem] overflow-hidden">
			<div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full">
				<div className="mb-[60px] md:mb-[40px] pb-[60px] md:pb-[40px] border-[#8E8E93]/25 border-b">
					<h6 className="after:top-[46%] after:right-0 after:absolute mx-auto pr-[45px] w-max after:w-[30px] max-w-full after:h-[5px] anim-text et-3-section-sub-title">
						Favoris
					</h6>
					<h2 className="mb-[26px] text-center anim-text et-3-section-title">Mes Événements Favoris</h2>
					<FiltreParticipant
						statusFilter={statusFilter}
						setStatusFilter={setStatusFilter}
						eventFilter={eventFilter}
						setEventFilter={setEventFilter}
						searchValue={searchValue}
						setSearchValue={setSearchValue}
						suggestions={suggestions}
						onSuggestionsFetchRequested={onSuggestionsFetchRequested}
						onSuggestionsClearRequested={onSuggestionsClearRequested}
						statuses={statuses}
						events={events}
						inputProps={inputProps}
					/>
				</div>

				{loading ? (
					[...Array(6)].map((_, i) => (
						<div key={i} className="rev-slide-up">
							<SkeletonEventCard />
						</div>
					))
				) : favoris.length === 0 ? (
					<div className="mt-10 text-center animate__animated animate__fadeIn h-full flex flex-col items-center justify-center">
						<p className="bg-clip-text bg-gradient-to-r from-[#580FCA] to-[#F929BB] font-semibold text-[20px] text-transparent">
							Vous n'avez aucun événement en favoris pour le moment.
						</p>
						<p className="mt-2 text-gray-500 text-sm">Explorez nos événements et regroupez vos préférés !</p>
						<Link
							to="/events"
							className="mt-4 inline-block px-6 py-3 rounded-lg bg-gradient-to-tr from-[#580FCA] to-[#F929BB] text-white font-semibold hover:opacity-90 transition"
						>
							Voir les événements
						</Link>
					</div>
				) : (
					favoris.map((event, index) => (
						<CardEvent
							key={index}
							event={event}
							isAuthenticated={!!user}
							isFavoris={(id) => isFavoris(id)}
							toggleFavoris={(id) => toggleFavoris(id, showToast)}
						/>
					))
				)}
			</div>

			{/* VECTORS + BACKGROUND */}
			<div className="*:-z-[1] *:absolute">
				<h3 className="xl:hidden bottom-[120px] left-[68px] xxl:left-[8px] et-outlined-text h-max font-bold text-[65px] uppercase tracking-widest -scale-[1] anim-text et-vertical-txt">
					événements favoris
				</h3>
				<div className="-top-[195px] -left-[519px] bg-gradient-to-b from-etPurple to-etPink blur-[230px] rounded-full w-[688px] aspect-square"></div>
				<div className="-right-[319px] bottom-[300px] bg-gradient-to-b from-etPink to-etPink blur-[230px] rounded-full w-[588px] aspect-square"></div>
				<img src={vector1} alt="vector" className="top-0 left-0 opacity-25" />
				<img src={vector1} alt="vector" className="right-0 bottom-0 opacity-25 rotate-180" />
				<img src={vector2} alt="vector" className="top-[33px] -right-[175px] animate-[etSpin_7s_linear_infinite]" />
			</div>
		</section>
	);
}

export default Favoris;
