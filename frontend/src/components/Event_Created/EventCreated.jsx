import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSlideUpAnimation from '../../hooks/Animations/useSlideUpAnimation';
import '../../assets/css/style.css';
import '../../assets/css/style.css';
import useTextAnimation from '../../hooks/Animations/useTextAnimation';

import SkeletonEventCard from '../SkeletonLoading/SkeletonEventCard';
import vector1 from "../../assets/img/et-3-event-vector.svg";
import vector2 from "../../assets/img/et-3-event-vector-2.svg";
import FiltreParticipant from '../Participant/FiltreParticipant';

function Event_Created({
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
    inputProps
}) {
    const [visibleParticipants, setVisibleParticipants] = useState({});

    const toggleParticipants = (eventId) => {
        setVisibleParticipants((prev) => ({
            ...prev,
            [eventId]: !prev[eventId]
        }));
    };

    useSlideUpAnimation('.rev-slide-up', filtered);

    return (
        <section className="z-[1] relative py-[60px] md:py-[60px] xl:py-[80px] overflow-hidden">
            <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full">
                <div className="mb-[60px] md:mb-[40px] pb-[60px] md:pb-[40px] border-[#8E8E93]/25 border-b">
                    <h6 className="after:top-[46%] after:right-0 after:absolute mx-auto pr-[45px] w-max after:w-[30px] max-w-full after:h-[5px] anim-text et-3-section-sub-title">
                        Vos créations
                    </h6>
                    <h2 className="mb-[26px] text-center anim-text et-3-section-title">Événements créés</h2>
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
                    />
                </div>

                {filtered.map((item, index) => {
                    const mainImage = item.EventImages?.find(img => img.is_main) || item.EventImages?.[0];
                    const imageUrl = mainImage?.image_url?.startsWith('http')
                        ? mainImage.image_url
                        : `${API_BASE_URL}${mainImage?.image_url || ''}`;

                    return (
                        <div key={index} className="relative flex lg:flex-wrap flex-nowrap items-center gap-[40px] opacity-1 py-[30px] border-[#8E8E93]/25 border-b rev-slide-up">

                            <h5 className="w-[120px] text-[24px] text-etBlue text-center shrink-0">
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
                                    <Link to={`/event/${item.id}`}>
                                        <h3 className="mb-[11px] font-semibold text-[30px] text-etBlack hover:text-etBlue truncate tracking-[-1px] transition-all duration-300 cursor-pointer anim-text">
                                            {capitalizeFirstLetter(item.title)}
                                        </h3>
                                    </Link>
                                    <h6 className="text-[17px] text-etBlue">
                                        <span><i className="mr-2 fas fa-map-marker-alt"></i></span>
                                        {capitalizeFirstLetter(item.city)}, {item.street_number} {item.street}
                                    </h6>
                                    <div className={`text-xs font-semibold px-3 py-1 rounded-full w-fit mt-2
                                        ${item.status === 'Planifié' ? 'bg-blue-100 text-blue-700' : ''}
                                        ${item.status === 'En Cours' ? 'bg-green-100 text-green-700' : ''}
                                        ${item.status === 'Terminé' ? 'bg-gray-200 text-gray-700' : ''}
                                        ${item.status === 'Annulé' ? 'bg-red-100 text-red-700' : ''}
                                    `}>{item.status}</div>
                                </div>
                                <h4 className="ml-auto font-semibold text-[30px] text-etBlue whitespace-nowrap">
                                    {formatEuro(item.price)}
                                </h4>
                            </div>
                            <div className="flex flex-col gap-3 justify-center items-center lg:items-end pl-[40px] border-[#8E8E93]/25 border-l text-center shrink-0">
                                <Link to={`/event/${item.id}`} className="et-3-btn w-max[161px]">
                                    Voir l'event
                                </Link>

                                {item.participants?.length > 0 && (
                                    <button
                                        onClick={() => toggleParticipants(item.id)}
                                        className="et-3-btn"
                                    >
                                        {visibleParticipants[item.id] ? "Masquer participants" : "Voir participants"}
                                    </button>
                                )}
                            </div>

                            {visibleParticipants[item.id] && (
                                <div className="mt-4 w-full bg-gray-50 p-4 rounded-lg border">
                                    <h5 className="text-lg font-bold mb-2">Participants inscrits</h5>
                                    {item.participants?.map((p, i) => (
                                        <div key={i} className="flex items-center gap-4 mb-3">
                                            <img
                                                src={`http://localhost:8080${p.User?.profileImage || ''}`}
                                                alt={`${p.User?.name || 'Participant'}`}
                                                className="w-10 h-10 rounded-full object-cover border"
                                            />
                                            <div className="text-left">
                                                <div className="font-semibold">{p.User?.name} {p.User?.lastname}</div>
                                                <div className="text-sm text-gray-500">{p.User?.email}</div>
                                                <div className="text-xs italic text-gray-400">Statut : {p.status}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="*:-z-[1] *:absolute">
                <h3 className="xl:hidden bottom-[120px] left-[68px] xxl:left-[8px] et-outlined-text h-max font-bold text-[65px] uppercase tracking-widest -scale-[1] anim-text et-vertical-txt">
                    événements créés
                </h3>
                <div className="-top-[195px] -left-[519px] bg-gradient-to-b from-etPurple to-etPink blur-[230px] rounded-full w-[688px] aspect-square"></div>
                <div className="-right-[319px] bottom-[300px] bg-gradient-to-b from-etPink to-etPink blur-[230px] rounded-full w-[588px] aspect-square"></div>
                <img src={vector1} alt="vector" className="top-0 left-0 opacity-25" />
                <img src={vector1} alt="vector" className="right-0 bottom-0 opacity-25 rotate-180" />
                <img src={vector2} alt="vector" className="top-[33px] -right-[175px] animate-[etSpin_7s_linear_infinite]" />
            </div>
        </section>
    );
}

export default Event_Created;