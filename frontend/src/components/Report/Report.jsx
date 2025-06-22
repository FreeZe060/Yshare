import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import '../../assets/css/style.css';
import useSlideUpAnimation from '../../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../../hooks/Animations/useTextAnimation';

import SkeletonEventCard from '../SkeletonLoading/SkeletonEventCard';
import vector1 from "../../assets/img/et-3-event-vector.svg";
import vector2 from "../../assets/img/et-3-event-vector-2.svg";

import FiltreParticipant from '../Participant/FiltreParticipant';

function Report({
    formatEuro,
    getFormattedDayAndMonthYear,
    capitalizeFirstLetter,
    API_BASE_URL,
    user,
    reports,
    loading,
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
    useSlideUpAnimation('.rev-slide-up', reports);
    useTextAnimation();

    return (
        <section className="z-[1] relative py-[120px] md:py-[60px] xl:py-[80px] overflow-hidden">
            <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full">
                <div className="mb-[60px] md:mb-[40px] pb-[60px] md:pb-[40px] border-[#8E8E93]/25 border-b">
                    <h6 className="after:top-[46%] after:right-0 after:absolute mx-auto pr-[45px] w-max after:w-[30px] max-w-full after:h-[5px] anim-text et-3-section-sub-title">
                        Signalements
                    </h6>
                    <h2 className="mb-[26px] text-center anim-text et-3-section-title">Mes signalements</h2>
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

                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="rev-slide-up">
                            <SkeletonEventCard />
                        </div>
                    ))
                ) : reports.length === 0 ? (
                    <p className="text-lg text-center">Aucun signalement trouvé.</p>
                ) : (
                    reports.map((report, index) => {
                        const event = report.event;
                        const imageUrl = event?.image?.startsWith('http')
                            ? event.image
                            : `${API_BASE_URL}${event?.image || ''}`;

                        return (
                            <div key={index} className="relative flex lg:flex-wrap flex-nowrap items-center gap-[40px] opacity-1 py-[30px] border-[#8E8E93]/25 border-b rev-slide-up">
                                <h5 className="w-[120px] text-[24px] text-etBlue text-center shrink-0">
                                    {report.date_reported && !isNaN(new Date(report.date_reported)) ? (
                                        <>
                                            <span className="block font-semibold text-[48px] text-etBlack leading-[0.7]">
                                                {getFormattedDayAndMonthYear(report.date_reported).day}
                                            </span>
                                            {getFormattedDayAndMonthYear(report.date_reported).monthYear}
                                        </>
                                    ) : (
                                        <span className="text-etBlack">??</span>
                                    )}
                                </h5>

                                <div className="shrink-0">
                                    <img
                                        src={imageUrl || vector1}
                                        alt="Event"
                                        className="rounded-xl w-full max-w-[300px] object-cover aspect-[300/128]"
                                    />
                                </div>

                                <div className="flex items-center gap-[78px] lg:gap-[38px] min-w-0 grow">
                                    <div className="min-w-0">
                                        <Link to={`/report/${report.id}`}>
                                            <h3 className="mb-[11px] font-semibold text-[30px] text-etBlack hover:text-etBlue truncate tracking-[-1px] transition-all duration-300 cursor-pointer anim-text">
                                                {capitalizeFirstLetter(event?.title || 'Événement supprimé')}
                                            </h3>
                                        </Link>
                                        <h6 className="text-[17px] text-etBlue">
                                            Signalé par {report.reportingUser?.name}
                                            {report.reportedUser && ` — Cible : ${report.reportedUser.name}`}
                                        </h6>
                                        <div className="text-xs font-semibold px-3 py-1 rounded-full w-fit mt-2 bg-gray-100 text-gray-600">
                                            Type : {report.type}
                                        </div>
                                    </div>
                                    <h4 className="ml-auto font-semibold text-[30px] text-etBlue whitespace-nowrap">
                                        {report.status}
                                    </h4>
                                </div>

                                <div className="pl-[40px] border-[#8E8E93]/25 border-l text-center shrink-0">
                                    <Link to={`/report/${report.id}`} className="et-3-btn">
                                        Voir le détail
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* VECTORS + BACKGROUND */}
            <div className="*:-z-[1] *:absolute">
                <h3 className="xl:hidden bottom-[120px] left-[68px] xxl:left-[8px] et-outlined-text h-max font-bold text-[65px] uppercase tracking-widest -scale-[1] anim-text et-vertical-txt">
                    vos signalements
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

export default Report;