import React from 'react';
import { motion } from "framer-motion";
import Autosuggest from 'react-autosuggest';
import { FaChevronDown } from 'react-icons/fa';

function FiltreReport({
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    types,
    statuses,
    suggestions,
    onSuggestionsFetchRequested,
    onSuggestionsClearRequested,
    searchValue,
    setSearchValue
}) {
    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col justify-center items-center mb-8 px-4 w-full"
            >
                <div className="flex flex-wrap justify-center gap-6 w-full max-w-4xl">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="relative w-52"
                    >
                        <select
                            onChange={e => setStatusFilter(e.target.value)}
                            value={statusFilter}
                            className="bg-white shadow-md px-4 py-2 border border-gray-300 hover:border-[#CE22BF] rounded-lg focus:outline-none focus:ring-[#CE22BF] focus:ring-2 w-full text-gray-700 transition duration-200 appearance-none"
                        >
                            <option value="">Filtrer par statut</option>
                            {statuses.map((status, i) => (
                                <option key={i} value={status}>{status}</option>
                            ))}
                        </select>
                        <div className="right-3 absolute inset-y-0 flex items-center text-gray-400 pointer-events-none">
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
                            onChange={e => setTypeFilter(e.target.value)}
                            value={typeFilter}
                            className="bg-white shadow-md px-4 py-2 border border-gray-300 hover:border-[#CE22BF] rounded-lg focus:outline-none focus:ring-[#CE22BF] focus:ring-2 w-full text-gray-700 transition duration-200 appearance-none"
                        >
                            <option value="">Filtrer par type de signalement</option>
                            {types.map((type, i) => (
                                <option key={i} value={type}>{type}</option>
                            ))}
                        </select>
                        <div className="right-3 absolute inset-y-0 flex items-center text-gray-400 pointer-events-none">
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
                                <div className="hover:bg-[#CE22BF] px-4 py-2 hover:text-white transition-all duration-200 cursor-pointer">
                                    {s}
                                </div>
                            )}
                            inputProps={{
                                placeholder: 'Rechercher un signalement...',
                                value: searchValue,
                                onChange: (_e, { newValue }) => setSearchValue(newValue),
                                className: 'w-full p-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#CE22BF] transition-all',
                            }}
                            theme={{
                                container: 'relative',
                                suggestionsContainer: 'absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg',
                                suggestionsList: 'max-h-60 overflow-y-auto divide-y divide-gray-100',
                                suggestionHighlighted: 'bg-[#CE22BF] text-white',
                            }}
                        />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

export default FiltreReport;