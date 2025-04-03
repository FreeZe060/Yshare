import React, { useEffect, useState } from 'react';
// import "../css/style.css";

import Header from "../components/Header";
// import BannerEvent from "../components/BannerEvent";
// import AboutEvent from "../components/About";
// import EventsList from "../components/EventsList";

import useEventDetails from "../hooks/Events/useEventDetails";
import useEvents from "../hooks/Events/useEvents";
import useComments from "../hooks/Comments/useComments";
import Footer from '../components/Footer';

function Home() {
	const { event: bannerEvent, loading: bannerLoading, error: bannerError } = useEventDetails(3);
	const { event: aboutEvent, loading: aboutLoading, error: aboutError } = useEventDetails(5);
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
			{/* <main>
				{bannerEvent && <BannerEvent event={bannerEvent} commentsCount={comments ? comments.length : 0} />}
				<EventsList events={events} />

				{eventDetails && <AboutEvent event={eventDetails} comments={comments} />}
				{events && <EventsList events={events.slice(0, 10)} />}
			</main> */}

			<Footer />
		</>
	);
}

export default Home;