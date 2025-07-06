import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import Swal from 'sweetalert2';
import '../../assets/css/style.css';
import useSlideUpAnimation from '../../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../../hooks/Animations/useTextAnimation';
import vector1 from "../../assets/img/et-3-event-vector.svg";
import vector2 from "../../assets/img/et-3-event-vector-2.svg";
import FiltreParticipant from './FiltreParticipant';

function Event_Participated({
    filtered,
    API_BASE_URL,
    getFormattedDayAndMonthYear,
    capitalizeFirstLetter,
    formatEuro,
    statusFilter,
    setStatusFilter,
    eventFilter,
    setEventFilter,
    searchValue,
    setSearchValue,
    suggestions,
    onSuggestionsFetchRequested,
    onSuggestionsClearRequested,
    statuses,
    events,
    inputProps,
    getStatusClass,
    updateMessage,
    updateGuests,
    removeParticipant,
    updateLocalParticipant
}) {
    const [visibleGuests, setVisibleGuests] = useState({});
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [messageDrafts, setMessageDrafts] = useState({});
    const [editingGuestsEventId, setEditingGuestsEventId] = useState(null);
    const [guestDrafts, setGuestDrafts] = useState({});


    const toggleGuests = (eventId) => {
        setVisibleGuests((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
    };

    useSlideUpAnimation('.rev-slide-up', filtered);
    useTextAnimation();

    const handleUpdateMessage = async (eventId, userId) => {
        try {
            const newMessage = messageDrafts[eventId];
            await updateMessage(eventId, userId, newMessage);
            setEditingMessageId(null);

            updateLocalParticipant?.(eventId, { request_message: newMessage });
        } catch (err) {
            console.error("Erreur de mise à jour du message:", err);
        }
    };


    const handleUpdateGuests = async (eventId, userId) => {
        const guestsToSend = guestDrafts[eventId] || [];

        if (!guestsToSend.length) return;

        try {
            const response = await updateGuests(eventId, userId, guestsToSend);

            setEditingGuestsEventId(null);

            const updatedGuests = response.guests;

            setGuestDrafts((prev) => ({
                ...prev,
                [eventId]: updatedGuests
            }));

            Swal.fire({
                toast: true,
                position: 'bottom-end',
                icon: 'success',
                title: 'Invités mis à jour avec succès',
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true
            });

        } catch (err) {
            console.error("❌ Erreur de mise à jour des invités:", err);
            Swal.fire({
                toast: true,
                position: 'bottom-end',
                icon: 'error',
                title: 'Erreur lors de la mise à jour',
                text: err.message,
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    const handleLeaveEvent = async (eventId, userId) => {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: 'Cette action est définitive et ne peut pas être annulée.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, me retirer',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                await removeParticipant(eventId, userId);

                await Swal.fire({
                    icon: 'success',
                    title: 'Retrait effectué',
                    text: 'Vous avez été retiré de cet événement.',
                    timer: 2500,
                    showConfirmButton: false,
                    timerProgressBar: true
                });

                window.location.reload();
            } catch (err) {
                console.error("Erreur en quittant l'événement:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Impossible de se retirer de l\'événement.',
                });
            }
        }
    };

    return (
        <section className="z-[1] relative py-[60px] md:py-[60px] xl:py-[80px] min-h-[60rem] overflow-hidden">
            <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full">
                <div className="mb-[60px] md:mb-[40px] pb-[60px] md:pb-[40px] border-[#8E8E93]/25 border-b">
                    <h6 className="after:top-[46%] after:right-0 after:absolute mx-auto pr-[45px] w-max after:w-[30px] max-w-full after:h-[5px] anim-text et-3-section-sub-title">
                        Vos participations
                    </h6>
                    <h2 className="mb-[26px] text-center anim-text et-3-section-title">Événements Participés</h2>
                    <FiltreParticipant
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
                        getStatusClass={getStatusClass}
                    />
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-col justify-center items-center mt-10 h-full text-center animate__animated animate__fadeIn">
                        <p className="bg-clip-text bg-gradient-to-r from-[#580FCA] to-[#F929BB] font-semibold text-[20px] text-transparent">
                            Vous n'avez participé à aucun événement pour le moment.
                        </p>
                        <p className="mt-2 text-gray-500 text-sm">Explorez nos événements et rejoignez l'aventure dès aujourd'hui !</p>
                        <Link
                            to="/events"
                            className="inline-block bg-gradient-to-tr from-[#580FCA] to-[#F929BB] hover:opacity-90 mt-4 px-6 py-3 rounded-lg font-semibold text-white transition"
                        >
                            Voir les événements
                        </Link>
                    </div>
                ) : (
                    filtered.map((item, index) => {
                        const imageUrl = item.image?.startsWith('http')
                            ? item.image
                            : `${API_BASE_URL}${item.image || ''}`;
                        return (
                            <div key={index} className="mb-[40px]">
                                <div className="relative flex lg:flex-wrap flex-nowrap items-center gap-[40px] opacity-1 py-[30px] border-[#8E8E93]/25 border-b rev-slide-up">
                                    <h5 className="w-[120px] text-[#CE22BF] text-[24px] text-center shrink-0">
                                        <span className="block font-semibold text-[48px] text-etBlack leading-[0.7]">
                                            {getFormattedDayAndMonthYear(item.start_time).day}
                                        </span>
                                        {getFormattedDayAndMonthYear(item.start_time).monthYear}
                                    </h5>
                                    <div className="shrink-0">
                                        <img
                                            src={imageUrl}
                                            alt="Event"
                                            className="rounded-xl w-full max-w-[300px] object-cover aspect-[300/128]"
                                        />
                                    </div>
                                    <div className="flex items-center gap-[78px] lg:gap-[38px] min-w-0 grow">
                                        <div className="min-w-0">
                                            <Link to={`/event/${item.id_event}`}>
                                                <h3 className="mb-[11px] font-semibold text-[30px] text-etBlack hover:text-[#CE22BF] truncate tracking-[-1px] transition-all duration-300 cursor-pointer anim-text">
                                                    {capitalizeFirstLetter(item.title)}
                                                </h3>
                                            </Link>

                                            <h6 className="text-[#CE22BF] text-[17px]">
                                                <span><i className="mr-2 fas fa-map-marker-alt"></i></span>
                                                {capitalizeFirstLetter(item.city)}, {item.street_number} {item.street}
                                            </h6>

                                            <div className="flex flex-col gap-1 mt-3 text-[11px] leading-tight">
                                                <div className={`px-2 text-xs py-[3px] rounded-full font-medium w-fit ${getStatusClass(item.status)}`}>
                                                    <span className="block">Votre statut : {item.status}</span>
                                                </div>
                                                <div className={`px-2 py-[3px] text-xs rounded-full font-medium w-fit ${getStatusClass(item.event_status)}`}>
                                                    <span className="block">Statut de l'événement : {item.event_status}</span>
                                                </div>
                                            </div>

                                            {item.organizer_response ? (
                                                <div className="mt-4">
                                                    <p className="mb-1 font-semibold text-[#CE22BF] text-sm">Message de l'organisateur :</p>
                                                    <div className="shadow-sm p-3 border border-blue-200 rounded-md text-gray-800 text-sm">
                                                        {item.organizer_response}
                                                    </div>
                                                    <details className="group mt-2">
                                                        <summary className="flex items-center gap-2 text-gray-700 text-sm transition-colors cursor-pointer">
                                                            <i className="text-[#CE22BF] transition-transform duration-300 fas fa-comment-dots" />
                                                            <span className="relative group-hover:text-[#CE22BF] transition-colors duration-300">
                                                                <span className="underline-animation">Voir mon message</span>
                                                            </span>
                                                        </summary>
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -5 }}
                                                            transition={{ duration: 0.4, ease: 'easeOut' }}
                                                            className="mt-2 p-3 border border-gray-300 rounded-md text-gray-700 text-sm italic"
                                                        >
                                                            {item.request_message}
                                                        </motion.p>
                                                    </details>
                                                </div>
                                            ) : (
                                                <div className="mt-4">
                                                    <p className="mb-1 font-semibold text-[#CE22BF] text-sm">Votre message :</p>
                                                    {editingMessageId === item.id_event ? (
                                                        <div className="flex flex-col gap-2">
                                                            <input
                                                                type="text"
                                                                value={messageDrafts[item.id_event] || ''}
                                                                onChange={(e) =>
                                                                    setMessageDrafts({ ...messageDrafts, [item.id_event]: e.target.value })
                                                                }
                                                                onBlur={() => handleUpdateMessage(item.id_event, item.id_user)}
                                                                className="shadow-sm px-3 py-1 border rounded"
                                                            />
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleUpdateMessage(item.id_event, item.id_user)}
                                                                    className="bg-[#CE22BF] px-3 py-1 rounded text-white"
                                                                >
                                                                    Enregistrer
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setMessageDrafts(prev => ({ ...prev, [item.id_event]: item.request_message }));
                                                                        setEditingMessageId(null);
                                                                    }}
                                                                    className="bg-gray-400 px-3 py-1 rounded text-white"
                                                                >
                                                                    Annuler
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.4 }}
                                                            className="p-3 border border-gray-300 rounded-md text-gray-800 text-sm italic"
                                                        >
                                                            {item.request_message}
                                                            <button
                                                                onClick={() => {
                                                                    setMessageDrafts(prev => ({
                                                                        ...prev,
                                                                        [item.id_event]: item.request_message || ''
                                                                    }));
                                                                    setEditingMessageId(item.id_event);
                                                                }}
                                                                className="ml-4 text-[#CE22BF] text-xs underline"
                                                            >
                                                                Modifier
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            )}

                                            <button
                                                onClick={() => handleLeaveEvent(item.id_event, item.id_user)}
                                                className="mt-3 text-red-600 text-sm underline"
                                            >
                                                Se retirer de l'événement
                                            </button>
                                        </div>
                                        <h4 className="ml-auto font-semibold text-[#CE22BF] text-[30px] whitespace-nowrap">
                                            {formatEuro(item.price)}
                                        </h4>
                                    </div>
                                    <div className="flex flex-col justify-center items-center lg:items-end gap-3 pl-[40px] border-[#8E8E93]/25 border-l min-w-[161px] sm:min-h-[161px] text-center shrink-0">
                                        <Link to={`/event/${item.id_event}`} className="min-w-[161px] et-3-btn">
                                            Voir l'event
                                        </Link>

                                        {item.guests?.length > 0 && (
                                            <button
                                                onClick={() => toggleGuests(item.id_event)}
                                                className="min-w-[161px] et-3-btn"
                                            >
                                                {visibleGuests[item.id_event] ? "Masquer invités" : "Voir invités"}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {visibleGuests[item.id_event] && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="bg-gray-50 mt-4 p-4 border rounded-lg w-full"
                                        >
                                            <h5 className="mb-4 font-bold text-lg">Invités ajoutés</h5>
                                            {item.guests.map((g, i) => {
                                                const isEditing = editingGuestsEventId === item.id_event;
                                                const currentDraft = guestDrafts[item.id_event]?.[i] || g;

                                                const updateGuestField = (field, value) => {
                                                    const originalGuests = item.guests;
                                                    const updated = [...(guestDrafts[item.id_event] || originalGuests)];

                                                    updated[i] = {
                                                        id: originalGuests[i]?.id,
                                                        ...updated[i],
                                                        [field]: value
                                                    };

                                                    console.log("✏️ Mise à jour draft invité :", updated[i]);

                                                    setGuestDrafts((prev) => ({
                                                        ...prev,
                                                        [item.id_event]: updated
                                                    }));
                                                };

                                                return (
                                                    <div key={i} className="flex items-center gap-4 mb-3">
                                                        {isEditing ? (
                                                            <div className="flex md:flex-row flex-col items-start md:items-center gap-2 w-full">
                                                                <input
                                                                    type="text"
                                                                    value={currentDraft.firstname}
                                                                    onChange={(e) => updateGuestField("firstname", e.target.value)}
                                                                    className="px-2 py-1 border rounded w-full md:w-[150px]"
                                                                    placeholder="Prénom"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={currentDraft.lastname}
                                                                    onChange={(e) => updateGuestField("lastname", e.target.value)}
                                                                    className="px-2 py-1 border rounded w-full md:w-[150px]"
                                                                    placeholder="Nom"
                                                                />
                                                                <input
                                                                    type="email"
                                                                    value={currentDraft.email}
                                                                    onChange={(e) => updateGuestField("email", e.target.value)}
                                                                    className="px-2 py-1 border rounded w-full md:w-[250px]"
                                                                    placeholder="Email"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="text-left">
                                                                <div className="font-semibold">{g.firstname} {g.lastname}</div>
                                                                <div className="text-gray-500 text-sm">{g.email}</div>
                                                            </div>
                                                        )}
                                                        {editingGuestsEventId === item.id_event ? (
                                                            <div className="flex gap-2 mt-2">
                                                                <button
                                                                    onClick={() => {
                                                                        if (!item?.id_user) return;
                                                                        handleUpdateGuests(item.id_event, item.id_user);
                                                                        setEditingGuestsEventId(null);
                                                                    }}
                                                                    className="bg-[#CE22BF] px-3 py-1 rounded text-white text-sm"
                                                                >
                                                                    Enregistrer
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setGuestDrafts((prev) => ({ ...prev, [item.id_event]: item.guests }));
                                                                        setEditingGuestsEventId(null);
                                                                    }}
                                                                    className="bg-gray-300 px-3 py-1 rounded text-sm"
                                                                >
                                                                    Annuler
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setGuestDrafts((prev) => ({
                                                                        ...prev,
                                                                        [item.id_event]: item.guests.map(g => ({
                                                                            id: g.id,
                                                                            firstname: g.firstname,
                                                                            lastname: g.lastname,
                                                                            email: g.email
                                                                        }))
                                                                    }));
                                                                    setEditingGuestsEventId(item.id_event);
                                                                }}
                                                                className="bg-[#CE22BF] mt-2 px-3 py-1 rounded text-white text-sm"
                                                            >
                                                                Modifier
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })
                )}

            </div>

            <div className="*:-z-[1] *:absolute">
                <h3 className="xl:hidden bottom-[120px] left-[68px] xxl:left-[8px] et-outlined-text h-max font-bold text-[65px] uppercase tracking-widest -scale-[1] anim-text et-vertical-txt">
                    événements rejoints
                </h3>
                <div className="-top-[195px] -left-[519px] bg-gradient-to-b from-etPurple to-etPink blur-[230px] rounded-full w-[688px] aspect-square"></div>
                <div className="-right-[319px] bottom-[300px] bg-gradient-to-b from-etPink to-etPink blur-[230px] rounded-full w-[588px] aspect-square"></div>
                <img src={vector1} alt="vector" className="top-0 left-0 opacity-25" />
                <img src={vector1} alt="vector" className="right-0 bottom-0 opacity-25 rotate-180" />
                <img src={vector2} alt="vector" className="top-[33px] -right-[175px] animate-[etSpin_7s_linear_infinite]" />
            </div>
        </section >
    );
}

export default Event_Participated;