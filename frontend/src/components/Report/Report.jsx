import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import '../../assets/css/style.css';
import useSlideUpAnimation from '../../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../../hooks/Animations/useTextAnimation';

import SkeletonEventCard from '../SkeletonLoading/SkeletonEventCard';
import vector1 from "../../assets/img/et-3-event-vector.svg";
import vector2 from "../../assets/img/et-3-event-vector-2.svg";

import FiltreReport from './/FiltreReport';
import ReportReplies from '../admin/Report/ReportReplies';

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
    inputProps,
    onDeleteReport,
    typeFilter,
    setTypeFilter,
    types
}) {
    useSlideUpAnimation('.rev-slide-up', reports);
    useTextAnimation();
    const [activeReportId, setActiveReportId] = useState(null);

    return (
        <section className="z-[1] relative py-[120px] md:py-[60px] xl:py-[80px] overflow-hidden">
            <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full">
                <div className="mb-[60px] md:mb-[40px] pb-[60px] md:pb-[40px] border-[#8E8E93]/25 border-b">
                    <h6 className="after:top-[46%] after:right-0 after:absolute mx-auto pr-[45px] w-max after:w-[30px] max-w-full after:h-[5px] anim-text et-3-section-sub-title">
                        Signalements
                    </h6>
                    <h2 className="mb-[26px] text-center anim-text et-3-section-title">Mes signalements</h2>
                    <FiltreReport
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
                        typeFilter={typeFilter}
                        setTypeFilter={setTypeFilter}
                        types={types}
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
                        let imageUrl = vector1;
                        let title = "Signalement";
                        let subtitle = "";
                        let statusInfo = "";
                        const dateObj = new Date(report.date_reported);

                        if (report.type === 'event' && report.event) {
                            imageUrl = report.event.image?.startsWith('http')
                                ? report.event.image
                                : `${API_BASE_URL}${report.event.image}`;
                            title = capitalizeFirstLetter(report.event.title || "Événement supprimé");
                            subtitle = `Créateur de l'évènement ${report.event.organizer?.name || 'inconnu'}`;
                            statusInfo = `Status de l'évènement : ${report.event.status}`;
                        }

                        if (report.type === 'user' && report.reportedUser) {
                            imageUrl = report.reportedUser.profileImage?.startsWith('http')
                                ? report.reportedUser.profileImage
                                : `${API_BASE_URL}${report.reportedUser.profileImage}`;
                            title = `Utilisateur : ${report.reportedUser.name}`;
                            subtitle = `Statut du compte : ${report.reportedUser.status}`;
                            statusInfo = "";
                        }

                        if (report.type === 'comment' && report.comment) {
                            imageUrl = report.comment.author?.profileImage?.startsWith('http')
                                ? report.comment.author.profileImage
                                : `${API_BASE_URL}${report.comment.author?.profileImage || ''}`;
                            title = `Commentaire : "${report.comment.content.slice(0, 50)}..."`;
                            subtitle = `Auteur : ${report.comment.author?.name}`;
                            statusInfo = "";
                        }

                        return (
                            <div key={index} className="relative flex lg:flex-wrap flex-nowrap items-center gap-[40px] opacity-1 py-[30px] border-[#8E8E93]/25 border-b rev-slide-up">
                                <h5 className="w-[120px] text-[#CE22BF] text-[24px] text-center shrink-0">
                                    {!isNaN(dateObj) ? (
                                        <>
                                            <span className="block font-semibold text-[48px] text-etBlack leading-[0.7]">
                                                {getFormattedDayAndMonthYear(dateObj).day}
                                            </span>
                                            {getFormattedDayAndMonthYear(dateObj).monthYear}
                                        </>
                                    ) : (
                                        <span className="text-etBlack">??</span>
                                    )}
                                </h5>

                                <div className="shrink-0">
                                    <img
                                        src={imageUrl}
                                        alt="Illustration"
                                        className="rounded-xl w-full max-w-[300px] object-cover aspect-[300/128]"
                                    />
                                </div>

                                <div className="flex items-center gap-[78px] lg:gap-[38px] min-w-0 grow">
                                    <div className="min-w-0">
                                        <Link to={`/report/${report.id}`}>
                                            <h3 className="mb-[11px] font-semibold text-[30px] text-etBlack hover:text-[#CE22BF] truncate tracking-[-1px] transition-all duration-300 cursor-pointer anim-text">
                                                {title}
                                            </h3>
                                        </Link>
                                        {subtitle && (
                                            <h6 className="text-[#CE22BF] text-[17px]">{subtitle}</h6>
                                        )}
                                        {statusInfo && (
                                            <div className="bg-gray-100 mt-2 px-3 py-1 rounded-full w-fit font-semibold text-gray-600 text-xs">
                                                {statusInfo}
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="ml-auto font-semibold text-[#CE22BF] text-[30px] whitespace-nowrap">
                                        {report.status}
                                    </h4>
                                </div>

                                <div className="flex flex-col justify-center items-center lg:items-end gap-3 pl-[40px] border-[#8E8E93]/25 border-l min-w-[161px] sm:min-h-[161px] text-center shrink-0">
                                    <button
                                        onClick={() => setActiveReportId(report.id)}
                                        className="min-w-[235px] et-3-btn"
                                    >
                                        Voir les messages
                                    </button>
                                    <button
                                        onClick={() => onDeleteReport(report.id)}
                                        className="min-w-[235px] text-red-600 hover:text-red-800 text-sm transition et-3-btn"
                                    >
                                        Supprimer le signalement
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            {activeReportId && (
                <div
                    className="z-[9999] fixed inset-0 flex justify-center items-center bg-black/50"
                    onClick={() => setActiveReportId(null)}
                >
                    <div
                        className="bg-white shadow-xl p-6 rounded-xl w-full max-w-[600px] max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ReportReplies reportId={activeReportId} />
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setActiveReportId(null)}
                                className="text-red-600 text-sm hover:underline"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

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