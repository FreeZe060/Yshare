import React from 'react';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../utils/format';

function EventHeaderInfo({ event }) {
    if (!event) return null;

    return (
        <div className="flex md:flex-row flex-col justify-between items-start md:items-end gap-4 mb-12 pb-8 border-[#e5e5e5] border-b">
            <div class="flex flex-row justify-between items-center gap-2 w-full">
                <h1 className="font-bold text-[42px] text-etBlack xs:text-[32px] leading-tight">
                    {capitalizeFirstLetter(event?.title)}
                </h1>
                {event && event.status && (
                    <div className={`text-xs font-semibold px-3 py-1 rounded-full w-fit mt-2
                            ${event.status === 'Planifié' ? 'bg-blue-100 text-blue-700' : ''}
                            ${event.status === 'En Cours' ? 'bg-green-100 text-green-700' : ''}
                            ${event.status === 'Terminé' ? 'bg-gray-200 text-gray-700' : ''}
                            ${event.status === 'Annulé' ? 'bg-red-100 text-red-700' : ''}
                        `}>
                        {event.status}
                    </div>
                )}

            </div>

            <div className="flex flex-col gap-2">
                <p className="mt-2 font-light text-[16px] text-etGray">
                    Créé par
                    {event?.organizer ? (
                        <div>
                            <Link
                                to={`/profile/${event.organizer.id}`}
                            >
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
                </p>
                <div className="text-left">
                    <p className="text-sm text-etGray mb-1 font-light tracking-wide uppercase">Quand</p>
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
                </div>

            </div>
        </div>
    );
}
export default EventHeaderInfo;