import React, { useEffect, useState } from 'react';
// import "../css/style.css";

import Header from "../components/Header";
import Footer from '../components/Footer';

// import BannerEvent from "../components/BannerEvent";
// import AboutEvent from "../components/About";
import EventsList from "../components/EventsList";
import CalendarEventSection from '../components/CalendarEventSection';

import useEventDetails from "../hooks/Events/useEventDetails";
import useEvents from "../hooks/Events/useEvents";
import useComments from "../hooks/Comments/useComments";
import AboutClub from '../components/AboutClub';
import EventsListEventics from '../components/EventsListEventics';


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

	if (bannerLoading || aboutLoading || eventsLoading) return <p>Chargement...</p>;
	if (bannerError) return <p>Erreur Banner: {bannerError}</p>;
	if (aboutError) return <p>Erreur About: {aboutError}</p>;
	if (eventsError) return <p>Erreur Events: {eventsError}</p>;

	return (
		<>
			<Header />
			<main>
				{/* {bannerEvent && <BannerEvent event={bannerEvent} commentsCount={comments ? comments.length : 0} />} */}
				<EventsListEventics events={events} />
				<AboutClub event={aboutClub} />
				<CalendarEventSection events={events} />
				{/* {eventDetails && <AboutEvent event={eventDetails} comments={comments} />}
				{events && <EventsList events={events.slice(0, 10)} />} */}
			</main>

			<Footer />
		</>
	);
}

export default Home;