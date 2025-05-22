import React, { useEffect, useState } from 'react';
import { useAuth } from '../config/authHeader';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import useUserEventHistory from '../hooks/Participant/useUserEventHistory';

const UserParticipationPage = () => {
    const { user } = useAuth();
    const [filtered, setFiltered] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [eventFilter, setEventFilter] = useState('');
    const [expanded, setExpanded] = useState(null);

    const { history, loading, error } = useUserEventHistory(user?.id);

    useEffect(() => {
        let filteredData = [...history];
        if (statusFilter) filteredData = filteredData.filter(p => p.status === statusFilter);
        if (eventFilter) filteredData = filteredData.filter(p => p.title === eventFilter);
        setFiltered(filteredData);
    }, [statusFilter, eventFilter, history]);

    const statuses = [...new Set(history.map(p => p.status))];
    const events = [...new Set(history.map(p => p.title))];

    return (
        <div className="p-6 max-w-6xl mx-auto font-sans">
            <h1 className="text-3xl font-bold text-center mb-6">Mes participations</h1>

            {loading && <p className="text-center text-gray-600">Chargement...</p>}
            {error && <p className="text-center text-red-500">Erreur : {error}</p>}

            {!loading && !error && (
                <>
                    <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
                        <select
                            onChange={e => setStatusFilter(e.target.value)}
                            className="border p-2 rounded shadow-sm"
                            value={statusFilter}
                        >
                            <option value="">Filtrer par statut</option>
                            {statuses.map((status, i) => (
                                <option key={i} value={status}>{status}</option>
                            ))}
                        </select>

                        <select
                            onChange={e => setEventFilter(e.target.value)}
                            className="border p-2 rounded shadow-sm"
                            value={eventFilter}
                        >
                            <option value="">Filtrer par événement</option>
                            {events.map((event, i) => (
                                <option key={i} value={event}>{event}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-6">
                        {filtered.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col md:flex-row items-center bg-white shadow-xl rounded-2xl p-4 gap-6"
                            >
                                <img src={item.image} alt={item.title} className="w-full md:w-64 h-40 object-cover rounded-xl" />

                                <div className="flex-1 space-y-2">
                                    <h2 className="text-xl font-bold">{item.title}</h2>
                                    <p className="text-sm text-gray-500">Début : {dayjs(item.start_time).format('DD/MM/YYYY HH:mm')}</p>
                                </div>

                                <div className="relative bg-gray-50 p-4 rounded-xl shadow-inner w-full md:w-96">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-semibold">
                                            {item.status}
                                        </span>
                                    </div>
                                    {item.request_message && (
                                        <p className="text-sm mb-2 italic">"{item.request_message}"</p>
                                    )}
                                    {item.organizer_response && (
                                        <p className="text-sm bg-green-50 border-l-4 border-green-500 p-2 rounded text-green-800">
                                            Réponse : {item.organizer_response}
                                        </p>
                                    )}

                                    {item.guests.length > 0 && (
                                        <div className="mt-4">
                                            <button
                                                className="flex items-center text-sm text-blue-600 hover:underline"
                                                onClick={() => setExpanded(expanded === index ? null : index)}
                                            >
                                                {expanded === index ? 'Masquer les invités' : 'Voir les invités'}
                                                <motion.span
                                                    animate={{ rotate: expanded === index ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="ml-2"
                                                >
                                                    <FaChevronDown />
                                                </motion.span>
                                            </button>

                                            <AnimatePresence>
                                                {expanded === index && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="mt-3 border-t pt-2"
                                                    >
                                                        {item.guests.map((g, i) => (
                                                            <div key={i} className="py-2 border-b last:border-b-0">
                                                                <p className="font-semibold">Invité {i + 1}</p>
                                                                <p className="text-sm">{g.firstname} {g.lastname}</p>
                                                                <p className="text-sm text-gray-500">{g.email}</p>
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default UserParticipationPage;
