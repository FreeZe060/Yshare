import React from 'react';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../../utils/format';

import EventStatusTag from '../../../utils/EventStatusTag';

function EventHeaderInfo({ event }) {
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
                        className="hover:bg-etBlue mt-4 px-4 py-2 border-2 border-etBlue rounded-full font-semibold text-etBlue hover:text-white text-sm transition-all"
                    >
                        <i className="mr-2 fas fa-plus"></i>Créer une news
                    </Link>
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
                    <p className="mb-1 font-light text-etGray text-sm uppercase tracking-wide">Quand</p>
                    <p className="font-sans font-semibold text-[17px] text-etBlack leading-relaxed">
                        <span className="font-bold text-etPurple">Du</span>{' '}
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
                        <span className="font-bold text-etPink">Au</span>{' '}
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