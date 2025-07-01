import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Autosuggest from 'react-autosuggest';
import { FaChevronDown } from 'react-icons/fa';

function FiltreParticipant({
    statusFilter,
    setStatusFilter,
    eventFilter,
    setEventFilter,
    events,
    statuses,
    suggestions = [],
    onSuggestionsFetchRequested,
    onSuggestionsClearRequested,
    searchValue,
    setSearchValue,
}) {
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isEventOpen, setIsEventOpen] = useState(false);
    const statusRef = useRef();
    const eventRef = useRef();

    // Gestion du clic en dehors pour fermer
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (statusRef.current && !statusRef.current.contains(e.target)) {
                setIsStatusOpen(false);
            }
            if (eventRef.current && !eventRef.current.contains(e.target)) {
                setIsEventOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col justify-center items-center mb-8 px-4 w-full"
            >
                <div className="flex flex-wrap justify-center gap-6 w-full max-w-4xl">

                    {/* Custom Select Status */}
                    <motion.div
                        ref={statusRef}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
                        className="relative w-52"
                    >
                        <div
                            onClick={() => setIsStatusOpen(!isStatusOpen)}
                            className="flex justify-between items-center bg-white shadow-md px-4 py-2 border border-gray-300 hover:border-[#a50fca] rounded-lg focus:outline-none focus:ring-[#a50fca] focus:ring-2 w-full text-gray-700 transition cursor-pointer"
                        >
                            {statusFilter || 'Filtrer par statut'}
                            <FaChevronDown className={`text-sm transform transition-transform duration-200 ${isStatusOpen ? 'rotate-180' : ''}`} />
                        </div>
                        <AnimatePresence>
                            {isStatusOpen && (
                                <motion.ul
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="z-10 absolute bg-white shadow-lg mt-2 rounded-md w-full"
                                >
                                    <li
                                        onClick={() => {
                                            setStatusFilter('');
                                            setIsStatusOpen(false);
                                        }}
                                        className="hover:bg-gradient-to-tr from-[#580FCA] to-[#F929BB] px-4 py-2 rounded-md hover:text-white transition-all duration-200 cursor-pointer"
                                    >
                                        Tous les statuts
                                    </li>
                                    {statuses.map((status, i) => (
                                        <li
                                            key={i}
                                            onClick={() => {
                                                setStatusFilter(status);
                                                setIsStatusOpen(false);
                                            }}
                                            className="hover:bg-gradient-to-tr from-[#580FCA] to-[#F929BB] px-4 py-2 hover:text-white transition-all duration-200 cursor-pointer"
                                        >
                                            {status}
                                        </li>
                                    ))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Custom Select Event */}
                    <motion.div
                        ref={eventRef}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
                        className="relative w-52"
                    >
                        <div
                            onClick={() => setIsEventOpen(!isEventOpen)}
                            className="flex justify-between items-center bg-white shadow-md px-4 py-2 border border-gray-300 hover:border-[#a50fca] rounded-lg focus:outline-none focus:ring-[#a50fca] focus:ring-2 w-full text-gray-700 transition cursor-pointer"
                        >
                            {eventFilter || 'Filtrer par événement'}
                            <FaChevronDown className={`text-sm transform transition-transform duration-200 ${isEventOpen ? 'rotate-180' : ''}`} />
                        </div>
                        <AnimatePresence>
                            {isEventOpen && (
                                <motion.ul
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="z-10 absolute bg-white shadow-lg mt-2 rounded-md w-full max-h-60 overflow-y-auto"
                                >
                                    <li
                                        onClick={() => {
                                            setEventFilter('');
                                            setIsEventOpen(false);
                                        }}
                                        className="hover:bg-gradient-to-tr from-[#580FCA] to-[#F929BB] px-4 py-2 hover:text-white transition cursor-pointer"
                                    >
                                        Tous les événements
                                    </li>
                                    {events.map((event, i) => (
                                        <li
                                            key={i}
                                            onClick={() => {
                                                setEventFilter(event);
                                                setIsEventOpen(false);
                                            }}
                                            className="hover:bg-gradient-to-tr from-[#580FCA] to-[#F929BB] px-4 py-2 hover:text-white transition cursor-pointer"
                                        >
                                            {event}
                                        </li>
                                    ))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Search Autosuggest */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
                        className="relative w-full md:w-72"
                    >
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={onSuggestionsClearRequested}
                            getSuggestionValue={s => s}
                            renderSuggestion={s => (
                                <div className="hover:bg-gradient-to-tr from-[#580FCA] to-[#F929BB] px-4 py-2 hover:text-white transition-all duration-200 cursor-pointer">
                                    {s}
                                </div>
                            )}
                            inputProps={{
                                placeholder: 'Rechercher un événement...',
                                value: searchValue,
                                onChange: (_e, { newValue }) => setSearchValue(newValue),
                                className: 'w-full p-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#580FCA] transition-all',
                            }}
                            theme={{
                                container: 'relative',
                                suggestionsContainer: 'absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg',
                                suggestionsList: 'max-h-60 overflow-y-auto divide-y divide-gray-100',
                                suggestionHighlighted: 'bg-gradient-to-tr from-[#580FCA] to-[#F929BB] text-white',
                            }}
                        />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

export default FiltreParticipant;
