import React from 'react';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../../utils/format';

import EventStatusTag from '../../../utils/EventStatusTag';

function EventHeaderInfo({ event,
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
    if (!event) return null;

    return (
        <div className="flex md:flex-row flex-col justify-between items-start md:items-end gap-4 mb-12 pb-8 border-[#e5e5e5] border-b">
            <div className="flex flex-row justify-between items-center gap-2 w-full">
                <h1 className="font-bold text-[42px] text-etBlack xs:text-[32px] leading-tight">
                    {capitalizeFirstLetter(event?.title)}
                </h1>
                <div className="flex flex-col items-end gap-2">
                    <EventStatusTag date={event.start_time} status={event.status} />
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
                            <p className="text-sm text-gray-600 mt-1">{averageRating ? averageRating.toFixed(2) : "0.00"} / 5</p>
                        </div>
                    )}

                    <Link
                        to="/create-news"
                        className="hover:bg-etBlue mt-4 px-4 py-2 border-2 border-etBlue rounded-full font-semibold text-etBlue hover:text-white text-sm transition-all"
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
                            className="text-sm text-[#C320C0] underline hover:text-[#a51899]"
                        >
                            {editing ? "Quitter le mode édition" : "Mode édition"}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="mt-2 font-light text-[16px] text-etGray">
                    <span>Créé par</span>
                    {event?.organizer ? (
                        <div>
                            <Link to={`/profile/${event.organizer.id}`}>
                                <img
                                    src={`http://localhost:8080${event.organizer.profileImage}`}
                                    alt="Organizer"
                                    className="inline-block mr-2 rounded-full w-8 h-8"
                                />
                                <span className="font-medium text-[#C320C0]">
                                    {event.organizer.name} {event.organizer.lastname}
                                </span>
                            </Link>
                        </div>
                    ) : (
                        <div className="text-etGray text-sm">Organisateur inconnu</div>
                    )}
                </div>
                <div className="text-left">
                    <p className="text-sm text-etGray mb-1 font-light tracking-wide uppercase">Quand</p>
                    {editing ? (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-etGray">Date de début :</label>
                            <input
                                type="datetime-local"
                                value={newStartDate}
                                onChange={(e) => setNewStartDate(e.target.value)}
                                className="border rounded p-2"
                            />
                            <label className="text-sm text-etGray">Date de fin :</label>
                            <input
                                type="datetime-local"
                                value={newEndDate}
                                onChange={(e) => setNewEndDate(e.target.value)}
                                className="border rounded p-2"
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
                        <p className="text-[17px] leading-relaxed text-etBlack font-semibold font-sans">
                            <span className="text-etPurple font-bold">Du</span>{' '}
                            {new Date(event?.start_time).toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}{' '}
                            à {new Date(event?.start_time).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                            <br />
                            <span className="text-etPink font-bold">Au</span>{' '}
                            {new Date(event?.end_time).toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}{' '}
                            à {new Date(event?.end_time).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
}
export default EventHeaderInfo;