import React, { useEffect, useState } from 'react';

import Header from "../components/Partials/Header";
import Footer from '../components/Partials/Footer';

import CalendarEventSection from '../components/Home/CalendarEventSection';

import useEventDetails from "../hooks/Events/useEventDetails";
import useEvents from "../hooks/Events/useEvents";
import useComments from "../hooks/Comments/useComments";

import BannerSection from '../components/Home/BannerSection';
import AboutClub from '../components/Home/AboutClub';
import EventsListEventics from '../components/Home/EventsListEventics';
import CookieBanner from '../components/Home/CookieBanner';


function Home() {
	const { event: bannerEvent, loading: bannerLoading, error: bannerError } = useEventDetails(3);
	const { event: aboutClub, loading: aboutLoading, error: aboutError } = useEventDetails(18);
	const { comments, loading: commentsLoading } = useComments(3);
	const [filters, setFilters] = useState({});
	const [page, setPage] = useState(1);

	const {
		events,
		loading: eventsLoading,
		error: eventsError,
		fetchData
	} = useEvents(filters, page, 10);


	useEffect(() => {	
		fetchData();
	}, [fetchData]);

	// if (bannerLoading || aboutLoading || eventsLoading) return <p>Chargement...</p>;
	if (bannerError) return <p>Erreur Banner: {bannerError}</p>;
	if (aboutError) return <p>Erreur About: {aboutError}</p>;
	if (eventsError) return <p>Erreur Events: {eventsError}</p>;

	return (
		<>
			<Header />
			<main>
				<BannerSection/>
				<EventsListEventics events={events} />
				<AboutClub event={aboutClub} />
				<CalendarEventSection events={events} />
			</main>

			<CookieBanner />

			<Footer />
		</>
	);
}

export default Home;