import React from 'react';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../utils/format';

import EventStatusTag from '../../utils/EventStatusTag';

function EventHeaderInfo({ event,
    canEditDate,
    editing,
    setEditing,
    newStartDate,
    setNewStartDate,
    newEndDate,
    setNewEndDate,
    handleCancelDates,
    handleSaveAllEdits
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

                    <Link
                        to="/create-news"
                        className="px-4 mt-4 py-2 text-sm font-semibold rounded-full border-2 border-etBlue text-etBlue hover:bg-etBlue hover:text-white transition-all"
                    >
                        <i className="fas fa-plus mr-2"></i>Créer une news
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
                                    className="w-8 h-8 rounded-full inline-block mr-2"
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