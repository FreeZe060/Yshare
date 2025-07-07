import React, { useEffect, useState } from 'react';
import { useAuth } from '../config/authHeader';
import useUserRatings from '../hooks/Rating/useUserRatings';
import EventRating from '../components/Rating/EventRating';
import Header from '../components/Partials/Header';
import Footer from '../components/Partials/Footer';
import vector1 from '../assets/img/et-3-event-vector.svg';
import { formatEuro, capitalizeFirstLetter } from '../utils/format';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const RatingsPage = () => {
    const { user, token } = useAuth();
    const [filtered, setFiltered] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [eventFilter, setEventFilter] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [expanded, setExpanded] = useState(null);

    const { ratings: userRatings, loading: ratingsLoading, error: ratingsError } = useUserRatings();

    const profileLink = `/profile/${user?.id}`;

    const getStatusClass = (status) => {
        switch (status) {
            case 'En Cours':
            case 'Inscrit':
                return 'bg-green-100 text-green-700';
            case 'Terminé':
                return 'bg-gray-200 text-gray-700';
            case 'Annulé':
                return 'bg-red-100 text-red-700';
            case 'Refusé':
                return 'bg-red-200 text-red-800';
            case 'Planifié':
                return 'bg-blue-100 text-blue-700';
            case 'En Attente':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    useEffect(() => {
        if (!userRatings) return;

        let data = [...userRatings];
        if (statusFilter) data = data.filter(r => r.event.status === statusFilter);
        if (eventFilter) data = data.filter(r => r.event.title === eventFilter);
        if (searchValue) data = data.filter(r => r.event.title.toLowerCase().includes(searchValue.toLowerCase()));
        setFiltered(data);
    }, [statusFilter, eventFilter, searchValue, userRatings]);

    const statuses = [...new Set(userRatings?.map(r => r.event.status).filter(Boolean))];
    const events = [...new Set(userRatings?.map(r => r.event.title).filter(Boolean))]

    const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        return events.filter(event => event.toLowerCase().includes(inputValue));
    };

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const updateLocalParticipant = (eventId, updatedFields) => {
        setFiltered(prev =>
            prev.map(p => (p.id_event === eventId ? { ...p, ...updatedFields } : p))
        );
    };

    const inputProps = {
        placeholder: 'Rechercher un événement...',
        value: searchValue,
        onChange: (_e, { newValue }) => setSearchValue(newValue),
        className: 'w-full md:w-72 p-2 border rounded shadow-sm',
    };

    return (
        <>
            <Header />
            <main>
                <section style={{
                    backgroundImage: `linear-gradient(to top right, #580FCA, #F929BB), url(${vector1})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundBlendMode: 'overlay',
                }}
                    className="z-[1] before:-z-[1] before:absolute relative bg-gradient-to-tr from-[#580FCA] to-[#F929BB] before:bg-cover before:bg-center before:opacity-30 pt-[210px] sm:pt-[160px] lg:pt-[190px] pb-[130px] sm:pb-[80px] lg:pb-[110px] et-breadcrumb">
                    <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full text-white text-center container">
                        <h1 className="font-medium text-[56px] xs:text-[45px] md:text-[50px] et-breadcrumb-title">
                            Toutes vos participations
                        </h1>
                        <ul className="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li className="opacity-80">
                                <a href="/" className="hover:text-[#CE22BF]">Accueil</a>
                            </li>
                            <li>
                                <i className="fa-angle-right fa-solid"></i>
                            </li>
                            <li className="opacity-80">
                                <a href={profileLink} className="hover:text-[#CE22BF]">Profil</a>
                            </li>
                            <li>
                                <i className="fa-angle-right fa-solid"></i>
                            </li>
                            <li className="current-page">Toutes vos participations</li>
                        </ul>
                    </div>
                </section>

                {!ratingsLoading && !ratingsError && (
                    <EventRating
                        formatEuro={formatEuro}
                        capitalizeFirstLetter={capitalizeFirstLetter}
                        filtered={filtered}
                        getStatusClass={getStatusClass}
                        expanded={expanded}
                        setExpanded={setExpanded}
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
                        REACT_APP_API_BASE_URL={REACT_APP_API_BASE_URL}
                        userRatings={userRatings}
                        ratingsLoading={ratingsLoading}
                        ratingsError={ratingsError}
                        userId={user?.id}
                        token={token}
                        updateLocalParticipant={updateLocalParticipant}
                    />
                )}
            </main>
            <Footer />
        </>
    );
};

export default RatingsPage;