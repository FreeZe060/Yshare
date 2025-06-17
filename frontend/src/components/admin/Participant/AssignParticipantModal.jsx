import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import AsyncSelect from 'react-select/async';
import useClickOutside from '../../../hooks/Utils/useClickOutside';
import { useAuth } from '../../../config/authHeader';

import useAllUsers from '../../../hooks/Admin/useAllUsers';
import useEvents from '../../../hooks/Events/useEvents';
import useAddParticipantAdmin from '../../../hooks/Admin/useAddParticipantAdmin';

const customStyles = {
    menu: (base) => ({
        ...base,
        zIndex: 100,
        backgroundColor: 'white',
        maxHeight: '180px',
        overflowY: 'auto',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? '#EEF2FF' : 'white',
        color: '#1F2937',
        padding: '8px 12px',
        cursor: 'pointer',
    }),
    control: (base, state) => ({
        ...base,
        borderRadius: '0.75rem',
        borderColor: state.isFocused ? '#6366F1' : '#CBD5E0',
        boxShadow: state.isFocused ? '0 0 0 1px #6366F1' : 'none',
        '&:hover': { borderColor: '#A0AEC0' },
        minHeight: '42px',
    }),
    singleValue: (base) => ({
        ...base,
        color: '#1F2937',
    }),
    placeholder: (base) => ({
        ...base,
        color: '#9CA3AF',
    }),
};

const AssignParticipantModal = ({ token, onClose, onSubmit }) => {
    const modalRef = useRef();
    const ignoreNextOutsideClick = useRef(false);

    const { user: authUser } = useAuth();
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const { users, loading: loadingUsers } = useAllUsers();
    const { assign, loading: addingParticipant } = useAddParticipantAdmin();
    const { events, fetchData: fetchEventsData, loading: loadingEvents } = useEvents({}, 1, 100, false);

    useEffect(() => {
        fetchEventsData();
    }, []);

    useClickOutside(modalRef, () => {
        if (ignoreNextOutsideClick.current) {
            ignoreNextOutsideClick.current = false;
            return;
        }
        onClose();
    });

    const userOptions = useMemo(() => users.map(user => ({
        value: user.id,
        label: `${user.name} ${user.lastname}`
    })), [users]);

    const eventOptions = useMemo(() => events.map(event => ({
        value: event.id,
        label: event.title
    })), [events]);

    const filterOptions = (options, inputValue) => {
        return options.filter(opt =>
            opt.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const loadUserOptions = (inputValue, callback) => {
        callback(filterOptions(userOptions, inputValue));
    };

    const loadEventOptions = (inputValue, callback) => {
        callback(filterOptions(eventOptions, inputValue));
    };

    const handleClear = () => {
        ignoreNextOutsideClick.current = true;
    };

    const handleSubmit = async () => {
        if (!selectedUser || !selectedEvent) return;

        try {
            await assign(selectedEvent.value, selectedUser.value, token);
            onSubmit();
            onClose();
        } catch (err) {
            console.error('❌ Erreur lors de l’assignation :', err);
            alert('Erreur : ' + err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-xl w-full max-w-lg space-y-5"
            >
                <h2 className="text-lg font-semibold text-gray-800">Assigner un participant</h2>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Utilisateur</label>
                    <AsyncSelect
                        cacheOptions
                        defaultOptions={userOptions}
                        loadOptions={loadUserOptions}
                        styles={customStyles}
                        onChange={setSelectedUser}
                        onMenuClose={handleClear}
                        placeholder="Rechercher un utilisateur"
                        isClearable
                        isLoading={loadingUsers}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Événement</label>
                    <AsyncSelect
                        cacheOptions
                        defaultOptions={eventOptions}
                        loadOptions={loadEventOptions}
                        styles={customStyles}
                        onChange={setSelectedEvent}
                        onMenuClose={handleClear}
                        placeholder="Rechercher un événement"
                        isClearable
                        isLoading={loadingEvents}
                    />
                </div>

                <div className="flex justify-end pt-4 gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={addingParticipant}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                    >
                        {addingParticipant ? 'Ajout en cours...' : 'Assigner'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AssignParticipantModal;
