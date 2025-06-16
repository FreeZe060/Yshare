import React, { useEffect, useState } from 'react';
import { useAuth } from '../config/authHeader';
import useUserEventHistory from '../hooks/Participant/useUserEventHistory';
import EventParticipant from '../components/Participant/EventParticipant';
import Header from '../components/Partials/Header';
import Footer from '../components/Partials/Footer';
import { formatEuro, getFormattedDayAndMonthYear, capitalizeFirstLetter } from '../utils/format';

const UserParticipationPage = () => {
    const { user } = useAuth();
    const [filtered, setFiltered] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [eventFilter, setEventFilter] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [expanded, setExpanded] = useState(null);

    const { history, loading, error } = useUserEventHistory(user?.id);
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
        let data = [...history];
        if (statusFilter) data = data.filter(p => p.status === statusFilter);
        if (eventFilter) data = data.filter(p => p.title === eventFilter);
        if (searchValue) data = data.filter(p => p.title.toLowerCase().includes(searchValue.toLowerCase()));
        setFiltered(data);
    }, [statusFilter, eventFilter, searchValue, history]);

    const statuses = [...new Set(history.map(p => p.status))];
    const events = [...new Set(history.map(p => p.title))];

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
                <section className="et-breadcrumb bg-[#000D83] pt-[210px] lg:pt-[190px] sm:pt-[160px] pb-[130px] lg:pb-[110px] sm:pb-[80px] relative z-[1] before:absolute before:inset-0 before:bg-no-repeat before:bg-cover before:bg-center before:-z-[1] before:opacity-30">
                    <div className="container mx-auto max-w-[1200px] px-[12px] xl:max-w-full text-center text-white">
                        <h1 className="et-breadcrumb-title font-medium text-[56px] md:text-[50px] xs:text-[45px]">
                            Toutes vos participations
                        </h1>
                        <ul className="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li className="opacity-80">
                                <a href="/" className="hover:text-etBlue">Accueil</a>
                            </li>
                            <li>
                                <i className="fa-solid fa-angle-right"></i>
                            </li>
                            <li className="opacity-80">
                                <a href={profileLink} className="hover:text-etBlue">Profil</a>
                            </li>
                            <li>
                                <i className="fa-solid fa-angle-right"></i>
                            </li>
                            <li className="current-page">Toutes vos participations</li>
                        </ul>
                    </div>
                </section>

                {!loading && !error && (
                    <EventParticipant
                        formatEuro={formatEuro}
                        getFormattedDayAndMonthYear={getFormattedDayAndMonthYear}
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
                    />
                )}
            </main>
            <Footer />
        </>
    );
};

export default UserParticipationPage;