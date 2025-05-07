import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import AsyncSelect from 'react-select/async';
import Swal from 'sweetalert2';

import useAllEvents from '../../hooks/Events/useEvents';
import useAllComments from '../../hooks/Comments/useAllComments';
import useAddComment from '../../hooks/Comments/useAddComment';
import useReplyComment from '../../hooks/Comments/useReplyComment';
import useClickOutside from '../../hooks/Utils/useClickOutside';

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
    singleValue: (base) => ({ ...base, color: '#1F2937' }),
    placeholder: (base) => ({ ...base, color: '#9CA3AF' }),
};

const CreateCommentModal = ({ onClose, onSubmit }) => {
    const modalRef = useRef();
    useClickOutside(modalRef, onClose);

    const { events } = useAllEvents();
    const { comments } = useAllComments();
    const { add } = useAddComment();
    const { reply } = useReplyComment();

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedComment, setSelectedComment] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const eventOptions = useMemo(() => events.map(event => ({
        value: event.id,
        label: event.title
    })), [events]);

    const commentOptions = useMemo(() => comments.map(comment => ({
        value: comment.id,
        label: `${comment.author} - ${comment.message.slice(0, 50)}...`,
        eventId: comment.eventId,
        eventTitle: comment.eventTitle
    })), [comments]);

    const filterOptions = (options, inputValue) =>
        options.filter(o => o.label.toLowerCase().includes(inputValue.toLowerCase()));

    const loadEventOptions = (inputValue, callback) =>
        callback(filterOptions(eventOptions, inputValue));

    const loadCommentOptions = (inputValue, callback) =>
        callback(filterOptions(commentOptions, inputValue));

    const handleSubmit = async () => {
        if (!selectedEvent || !message.trim()) {
            Swal.fire('Erreur', 'Veuillez remplir les champs requis.', 'error');
            return;
        }

        if (selectedComment && selectedComment.eventId !== selectedEvent.value) {
            Swal.fire(
                'Erreur de correspondance',
                `Veuillez sélectionner le même événement que celui du commentaire auquel vous répondez.\n\nÉvénement du commentaire sélectionné : "${selectedComment.eventTitle}"`,
                'warning'
            );
            return;
        }

        setLoading(true);
        try {
            if (selectedComment) {
                console.log('🟣 Envoi via replyComment :', {
                    eventId: selectedEvent.value,
                    parentId: selectedComment.value
                });
                await reply(selectedEvent.value, selectedComment.value, { message });
            } else {
                console.log('🔵 Envoi via addComment :', {
                    eventId: selectedEvent.value
                });
                await add(selectedEvent.value, { message });
            }

            Swal.fire('Succès', 'Commentaire ajouté.', 'success');
            onSubmit();
            onClose();
        } catch (err) {
            Swal.fire('Erreur', err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl space-y-5"
            >
                <h2 className="text-xl font-bold text-gray-800">Ajouter un commentaire</h2>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Événement *</label>
                    <AsyncSelect
                        cacheOptions
                        defaultOptions={eventOptions}
                        loadOptions={loadEventOptions}
                        styles={customStyles}
                        placeholder="Rechercher un événement"
                        onChange={setSelectedEvent}
                        isClearable
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Commentaire parent (facultatif)</label>
                    <AsyncSelect
                        cacheOptions
                        defaultOptions={commentOptions}
                        loadOptions={loadCommentOptions}
                        styles={customStyles}
                        placeholder="Rechercher un commentaire"
                        onChange={setSelectedComment}
                        isClearable
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Message *</label>
                    <textarea
                        className="w-full px-3 py-2 border rounded text-black"
                        rows={4}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Votre message..."
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button onClick={onClose} className="text-gray-600 hover:underline">Annuler</button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        {loading ? 'Création...' : 'Créer'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default CreateCommentModal;