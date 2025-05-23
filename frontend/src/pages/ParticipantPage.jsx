import React, { useEffect, useState } from 'react';
import { useAuth } from '../config/authHeader';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import useUserEventHistory from '../hooks/Participant/useUserEventHistory';
import Autosuggest from 'react-autosuggest';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

                <div className="p-6 max-w-6xl mx-auto font-sans">
                    <h1 className="text-3xl font-bold text-center mb-6">Mes participations</h1>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full flex flex-col items-center justify-center mb-8 px-4"
                    >
                        <div className="flex flex-wrap justify-center gap-6 max-w-4xl w-full">

                            {/* FILTRE STATUT */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                className="relative w-52"
                            >
                                <select
                                    onChange={e => setStatusFilter(e.target.value)}
                                    value={statusFilter}
                                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 text-gray-700 shadow-md transition duration-200 hover:border-etBlue focus:outline-none focus:ring-2 focus:ring-etBlue"
                                >
                                    <option value="">Filtrer par statut</option>
                                    {statuses.map((status, i) => (
                                        <option key={i} value={status}>{status}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                    <FaChevronDown className="text-sm" />
                                </div>
                            </motion.div>

                            {/* FILTRE ÉVÉNEMENT */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                                className="relative w-52"
                            >
                                <select
                                    onChange={e => setEventFilter(e.target.value)}
                                    value={eventFilter}
                                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 text-gray-700 shadow-md transition duration-200 hover:border-etBlue focus:outline-none focus:ring-2 focus:ring-etBlue"
                                >
                                    <option value="">Filtrer par événement</option>
                                    {events.map((event, i) => (
                                        <option key={i} value={event}>{event}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                    <FaChevronDown className="text-sm" />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                                className="relative w-full md:w-72"
                            >
                                <Autosuggest
                                    suggestions={suggestions}
                                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                                    getSuggestionValue={s => s}
                                    renderSuggestion={s => (
                                        <div className="px-4 py-2 hover:bg-etBlue hover:text-white transition-all duration-200 cursor-pointer">
                                            {s}
                                        </div>
                                    )}
                                    inputProps={{
                                        placeholder: 'Rechercher un événement...',
                                        value: searchValue,
                                        onChange: (_e, { newValue }) => setSearchValue(newValue),
                                        className: 'w-full p-2  rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-etBlue transition-all',
                                    }}
                                    theme={{
                                        container: 'relative',
                                        suggestionsContainer: 'absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg ',
                                        suggestionsList: 'max-h-60 overflow-y-auto divide-y divide-gray-100',
                                        suggestionHighlighted: 'bg-etBlue text-white',
                                    }}
                                />
                            </motion.div>
                        </div>
                    </motion.div>


                    {loading && <p className="text-center text-gray-600">Chargement...</p>}
                    {error && <p className="text-center text-red-500">Erreur : {error}</p>}

                    {!loading && !error && (
                        <div className="space-y-10">
                            {filtered.map((item, index) => (
                                <React.Fragment key={index}>
                                    <div className="et-schedule flex md:flex-wrap gap-x-[20px] gap-y-[15px] justify-between sm:justify-center rounded-[15px]">
                                        <div className="w-[300px] rounded-[15px] overflow-hidden shadow-md flex flex-col bg-white">
                                            <img
                                                src={`http://localhost:8080${item.image}`}
                                                alt={item.title}
                                                className="object-cover w-full h-[190px] rounded-t-[10px]"
                                            />

                                            <h3 className="mt-3 text-[18px] font-semibold text-etBlack text-center line-clamp-2">
                                                <Link to={`/event/${item.id_event}`} className="hover:text-etBlue transition-colors duration-200">
                                                    {item.title}
                                                </Link>
                                            </h3>

                                            <Link
                                                to={`/profile/${item.organizer?.id}`}
                                                className="mt-2 ml-4 flex items-center mb-2 gap-2 text-sm text-gray-600 hover:text-etBlue transition"
                                            >
                                                <img
                                                    src={`http://localhost:8080${item.organizer?.image}`}
                                                    alt="organizer"
                                                    className="w-8 h-8 rounded-full border border-gray-300 hover:scale-105 transition"
                                                />
                                                <span className="font-medium">{item.organizer?.name} {item.organizer?.lastname}</span>
                                            </Link>
                                        </div>


                                        <div className="px-[20px] sm:px-[15px] py-[20px] shadow-md w-full rounded-[15px] flex gap-y-[10px] xs:flex-col bg-white transition duration-300 hover:shadow-lg">
                                            <div className="et-schedule__heading pr-[25px] sm:pr-[15px] min-w-[550px] sm:min-w-0 xs:pr-0 mr-[25px] sm:mr-[15px] xs:mr-0 border-r xs:border-r-0 border-[#d9d9d9]">
                                                <div className="flex justify-between items-center mb-[8px]">
                                                    <div className="et-schedule-date-time border border-gray-300 py-[5px] px-[10px] rounded-full inline-flex items-center gap-x-[12px] text-sm bg-gray-50 animate-fade-in">
                                                        <span className="icon">📅</span>
                                                        <span className="text-etGray">
                                                            {dayjs(item.start_time).format('DD/MM/YYYY HH:mm')} - {dayjs(item.end_time).format('DD/MM/YYYY HH:mm')}
                                                        </span>
                                                    </div>

                                                    <div className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${getStatusClass(item.status)}`}>
                                                        {item.status}
                                                    </div>
                                                </div>

                                                <div className="mt-2 text-sm text-etGray font-medium ml-2">
                                                    Statut de l'événement :
                                                    <span className={`ml-2 inline-block text-xs font-semibold px-3 py-1 rounded-full ${getStatusClass(item.event_status)}`}>
                                                        {item.event_status}
                                                    </span>
                                                </div>

                                                <div className="et-schedule-loaction flex items-center gap-[8px] text-sm text-etGray mt-2">
                                                    <span className="icon">📍</span>
                                                    <span>{`${item.street_number} ${item.street}, ${item.city} ${item.postal_code || ''}`}</span>
                                                </div>

                                                {item.organizer_response ? (
                                                    <div className="mt-3 text-sm text-etGray animate-fade-in">
                                                        <p className="font-semibold text-green-700 mb-1">Réponse de l’organisateur :</p>
                                                        <p className="border border-green-300 bg-green-50 text-green-900 rounded p-2 text-sm shadow-sm">
                                                            {item.organizer_response}
                                                        </p>

                                                        {item.request_message && (
                                                            <details className="mt-3 transition-all">
                                                                <summary className="cursor-pointer text-sm text-blue-600 hover:underline hover:text-etBlue font-medium">
                                                                    Voir votre message envoyé
                                                                </summary>
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: 'auto' }}
                                                                    transition={{ duration: 0.3 }}
                                                                    className="mt-2"
                                                                >
                                                                    <p className="border border-blue-300 bg-blue-50 text-blue-900 rounded p-2 text-sm shadow-sm">
                                                                        {item.request_message}
                                                                    </p>
                                                                </motion.div>
                                                            </details>
                                                        )}
                                                    </div>
                                                ) : item.request_message ? (
                                                    <div className="mt-3 text-sm text-etGray animate-fade-in">
                                                        <p className="font-semibold text-blue-700 mb-1">Votre message :</p>
                                                        <p className="border border-blue-300 bg-blue-50 text-blue-900 rounded p-2 text-sm shadow-sm">
                                                            {item.request_message}
                                                        </p>
                                                    </div>
                                                ) : null}

                                            </div>

                                            <div className="flex flex-col justify-center items-center gap-y-3 ml-12">
                                                <Link
                                                    to={`/event/${item.id_event}`}
                                                    className="et-btn border border-etBlue text-etBlue inline-flex items-center justify-center gap-x-2 h-[36px] px-4 text-sm rounded-full transition hover:bg-etBlue hover:text-white"
                                                >
                                                    Voir l’événement
                                                </Link>

                                                {item.guests.length > 0 && (
                                                    <button
                                                        className="et-btn border border-etBlue text-etBlue inline-flex items-center justify-center gap-x-2 h-[36px] px-4 text-sm rounded-full transition hover:bg-etBlue hover:text-white"
                                                        onClick={() => setExpanded(expanded === index ? null : index)}
                                                    >
                                                        Voir les invités
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {expanded === index && item.guests.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                                className="ml-[250px] px-[20px] sm:px-[15px] py-[20px] shadow-md rounded-[15px] bg-white mt-2"
                                            >
                                                <motion.div
                                                    className="flex flex-col gap-6"
                                                    initial="hidden"
                                                    animate="visible"
                                                    variants={{
                                                        visible: { transition: { staggerChildren: 0.1 } },
                                                    }}
                                                >
                                                    {item.guests.map((g, i) => (
                                                        <motion.div
                                                            key={i}
                                                            variants={{
                                                                hidden: { opacity: 0, y: 10 },
                                                                visible: { opacity: 1, y: 0 },
                                                            }}
                                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                                            className="border-b border-gray-200 pb-5 last:border-b-0 relative"
                                                        >
                                                            <div className="absolute top-2 right-4 text-xs font-semibold text-gray-500 uppercase">
                                                                Invité {i + 1}
                                                            </div>
                                                            <div className="flex flex-col items-start text-left gap-y-2 mt-6">
                                                                <div>
                                                                    <p className="text-sm text-gray-500">Nom</p>
                                                                    <p className="text-lg font-semibold text-gray-800">{g.lastname}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-500">Prénom</p>
                                                                    <p className="text-lg font-semibold text-gray-800">{g.firstname}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-500">Email</p>
                                                                    <p className="text-base text-gray-700">{g.email}</p>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default UserParticipationPage;