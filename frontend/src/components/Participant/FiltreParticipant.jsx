import React from 'react';
import { motion } from "framer-motion";
import Autosuggest from 'react-autosuggest';
import { FaChevronDown } from 'react-icons/fa';

function FiltreParticipant({
    statusFilter,
    setStatusFilter,
    eventFilter,
    setEventFilter,
    events,
    statuses,
    suggestions,
    onSuggestionsFetchRequested,
    onSuggestionsClearRequested,
    searchValue,
    setSearchValue,
    inputProps
}) {
    return (
        <div>
            <h1 className="text-3xl font-bold text-center mb-6">Mes participations</h1>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full flex flex-col items-center justify-center mb-8 px-4"
            >
                <div className="flex flex-wrap justify-center gap-6 max-w-4xl w-full">

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
        </div>
    );
}

export default FiltreParticipant;