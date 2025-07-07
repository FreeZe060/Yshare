import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../../utils/format';

import EventStatusTag from '../EventStatusTag';
import EventCategoryTag from '../EventCategoryTag';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function EventHeaderInfo({
    event,
    canEditDate,
    editing,
    setEditing,
    newStartDate,
    setNewStartDate,
    newEndDate,
    setNewEndDate,
    handleCancelDates,
    handleSaveAllEdits,
    averageRating,
    ratingLoading,
    ratings,
    onClickRating
}) {
    const [localStatus, setLocalStatus] = useState(event?.status ?? '');

    useEffect(() => {
        setLocalStatus(event?.status ?? '');
    }, [event?.status]);

    if (!event) return null;

    const handleStatusChange = (newStatus) => {
        setLocalStatus(newStatus);
    };

    return (
        <div className="flex md:flex-row flex-col justify-between items-start md:items-end gap-4 mb-12 pb-8 border-[#e5e5e5] border-b">
            <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-center gap-2">
                    <h1 className="font-bold text-[42px] text-etBlack xs:text-[32px] leading-tight">
                        {capitalizeFirstLetter(event?.title)}
                    </h1>
                    <EventStatusTag
                        date={event.start_time}
                        status={localStatus}
                        eventId={event.id}
                        onStatusChange={(newStatus) => handleStatusChange(newStatus)}
                    />
                </div>

                <div>
                    {event.Categories.length > 0 && (
                        event.Categories.map((category, index) => (
                            <EventCategoryTag
                                key={index}
                                category={category.name}
                                className="mt-2 mr-2"
                            />
                        ))
                    )}
                </div>
                <div className="flex flex-col items-end gap-2">

                    {event.status === 'Terminé' && averageRating !== null && (
                        <div className="flex flex-col items-center mt-2" onClick={onClickRating} style={{ cursor: 'pointer' }}>
                            <div className="flex">
                                {Array.from({ length: 5 }, (_, index) => {
                                    const fillPercentage = Math.min(Math.max(averageRating - index, 0), 1) * 100;

                                    return (
                                        <svg
                                            key={index}
                                            className="w-6 h-6"
                                            viewBox="0 0 20 20"
                                        >
                                            <defs>
                                                <linearGradient id={`grad${index}`}>
                                                    <stop offset={`${fillPercentage}%`} stopColor="#facc15" /> {/* jaune */}
                                                    <stop offset={`${fillPercentage}%`} stopColor="#d1d5db" /> {/* gris clair */}
                                                </linearGradient>
                                            </defs>
                                            <path
                                                fill={`url(#grad${index})`}
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.376 2.455c-.784.57-1.838-.197-1.539-1.118l1.285-3.97a1 1 0 00-.364-1.118L2.63 9.397c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.97z"
                                            />
                                        </svg>
                                    );
                                })}
                            </div>
                            <p className="mt-1 text-gray-600 text-sm">{averageRating ? averageRating.toFixed(2) : "0.00"} / 5</p>
                        </div>
                    )}

                    <Link
                        to="/news/create"
                        className="hover:bg-[#CE22BF] mt-4 px-4 py-2 border-[#CE22BF] border-2 rounded-full font-semibold text-[#CE22BF] hover:text-white text-sm transition-all"
                    >
                        <i className="mr-2 fas fa-plus"></i>Créer une news
                    </Link>
                    {canEditDate && (
                        <button
                            onClick={() => {
                                if (editing) {
                                    handleSaveAllEdits();
                                } else {
                                    setEditing(true);
                                }
                            }}
                            className="text-[#C320C0] hover:text-[#a51899] text-sm underline"
                        >
                            {editing ? "Quitter le mode édition" : "Mode édition"}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex md:flex-row flex-col gap-6 mt-4">
                <div className="flex flex-col items-start">
                    <p className="mb-1 font-light text-etGray text-sm uppercase tracking-wide">Créé par</p>
                    {event?.organizer ? (
                        <Link to={`/profile/${event.organizer.id}`} className="group flex items-center gap-3">
                            <img
                                src={event.organizer.profileImage ? `${REACT_APP_API_BASE_URL}${event.organizer.profileImage}` : '/default-avatar.png'}
                                alt={`${event.organizer.name} ${event.organizer.lastname}`}
                                className="shadow-md border-2 border-etPink rounded-full w-10 h-10 group-hover:scale-105 transition-transform duration-200"
                            />
                            <span className="font-medium text-[#C320C0] group-hover:underline">
                                {event.organizer.name} {event.organizer.lastname}
                            </span>
                        </Link>
                    ) : (
                        <div className="text-etGray text-sm">Organisateur inconnu</div>
                    )}
                </div>

                <div className="text-left">
                    <p className="mb-1 font-light text-etGray text-sm uppercase tracking-wide">Quand</p>
                    {editing ? (
                        <div className="flex flex-col gap-2">
                            <label className="text-etGray text-sm">Date de début :</label>
                            <input
                                type="datetime-local"
                                value={newStartDate}
                                onChange={(e) => setNewStartDate(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <label className="text-etGray text-sm">Date de fin :</label>
                            <input
                                type="datetime-local"
                                value={newEndDate}
                                onChange={(e) => setNewEndDate(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <div className="flex gap-3 mt-2">
                                <button
                                    onClick={handleCancelDates}
                                    className="text-gray-600 underline"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <h5 className="mb-1 text-[#BF1FC0] text-[20px] md:text-[18px]">
                                    <span className="block font-semibold text-[42px] text-etBlack md:text-[32px] leading-[0.7]">
                                        {new Date(event?.start_time).toLocaleDateString("fr-FR", { day: "2-digit" })}
                                    </span>
                                    <span className="block text-[16px] md:text-[14px]">
                                        {new Date(event?.start_time).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                                    </span>
                                </h5>
                                <p className="font-medium text-[15px] text-etGray">
                                    {new Date(event?.start_time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>

                            <span className="text-[28px] text-etPurple md:text-[24px]">→</span>

                            <div className="text-center">
                                <h5 className="mb-1 text-[#BF1FC0] text-[20px] md:text-[18px]">
                                    <span className="block font-semibold text-[42px] text-etBlack md:text-[32px] leading-[0.7]">
                                        {new Date(event?.end_time).toLocaleDateString("fr-FR", { day: "2-digit" })}
                                    </span>
                                    <span className="block text-[16px] md:text-[14px]">
                                        {new Date(event?.end_time).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                                    </span>
                                </h5>
                                <p className="font-medium text-[15px] text-etGray">
                                    {new Date(event?.end_time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>
                        </div>

                    )}
                </div>
            </div>

        </div>
    );
}

export default EventHeaderInfo;