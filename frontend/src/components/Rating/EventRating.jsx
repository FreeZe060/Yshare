import React from 'react';
import { Link } from 'react-router-dom';
import vector1 from "../../assets/img/et-3-event-vector.svg";
import vector2 from "../../assets/img/et-3-event-vector-2.svg";
import FiltreParticipant from '../Participant/FiltreParticipant';
import useSlideUpAnimation from '../../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../../hooks/Animations/useTextAnimation';

function EventRating({
    filtered,
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
}) {
    useSlideUpAnimation('.rev-slide-up', filtered);
    useTextAnimation();
    return (
        <section className="z-[1] relative py-[60px] md:py-[60px] xl:py-[80px] min-h-[60rem] overflow-hidden">
            <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full">
                <div className="mb-[60px] md:mb-[40px] pb-[60px] md:pb-[40px] border-[#8E8E93]/25 border-b">
                    <h6 className="after:top-[46%] after:right-0 after:absolute mx-auto pr-[45px] w-max after:w-[30px] max-w-full after:h-[5px] anim-text et-3-section-sub-title">
                        Vos Notes
                    </h6>
                    <h2 className="mb-[26px] text-center anim-text et-3-section-title">Notes créées</h2>
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
                            Vous n'avez encore noté aucun événement.
                        </p>
                        <p className="mt-2 text-gray-500 text-sm">Participez à des événements et donnez votre avis !</p>
                        <Link
                            to="/events"
                            className="inline-block bg-gradient-to-tr from-[#580FCA] to-[#F929BB] hover:opacity-90 mt-4 px-6 py-3 rounded-lg font-semibold text-white transition"
                        >
                            Voir les événements
                        </Link>
                    </div>
                ) : (
                    filtered.map((item, index) => {
                        const imageUrl = item.event.mainImage?.startsWith('http')
                            ? item.event.mainImage
                            : `${item.event.mainImage || ''}`;

                        return (
                            <div key={index} className="mb-[40px]">
                                <div className="relative flex lg:flex-wrap flex-nowrap items-center gap-[40px] py-[30px] border-[#8E8E93]/25 border-b rev-slide-up">

                                    <div className="shrink-0">
                                        <img
                                            src={imageUrl}
                                            alt="Event"
                                            className="rounded-xl w-full max-w-[300px] object-cover aspect-[300/128]"
                                        />
                                    </div>

                                    <div className="flex items-center gap-[78px] lg:gap-[38px] min-w-0 grow">
                                        <div className="min-w-0">
                                            <Link to={`/event/${item.event.id}`}>
                                                <h3 className="mb-[11px] font-semibold text-[30px] text-etBlack hover:text-etBlue truncate tracking-[-1px] transition-all duration-300">
                                                    {capitalizeFirstLetter(item.event.title)}
                                                </h3>
                                            </Link>

                                            <div className="mt-4">
                                                <p className="mb-1 font-semibold text-etBlue text-sm">Votre note :</p>
                                                <div className="p-3 border border-gray-300 rounded-md text-gray-800 text-sm italic">
                                                    {item.rating} / 5
                                                </div>
                                            </div>

                                            {item.message && (
                                                <div className="mt-4">
                                                    <p className="mb-1 font-semibold text-etBlue text-sm">Votre message :</p>
                                                    <div className="p-3 border border-gray-300 rounded-md text-gray-800 text-sm italic">
                                                        {item.message}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <h4 className="ml-auto font-semibold text-[30px] text-etBlue whitespace-nowrap">
                                            {formatEuro(item.event.price || 0)}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="*:-z-[1] *:absolute">
                <h3 className="xl:hidden bottom-[120px] left-[68px] xxl:left-[8px] et-outlined-text h-max font-bold text-[65px] uppercase tracking-widest -scale-[1] anim-text et-vertical-txt">
                    notes créées
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

export default EventRating;
