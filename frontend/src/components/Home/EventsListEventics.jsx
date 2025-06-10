import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Swal from 'sweetalert2';

import '../../assets/css/style.css';
import useSlideUpAnimation from '../../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../../hooks/Animations/useTextAnimation';

import SkeletonEventCard from '../SkeletonLoading/SkeletonEventCard';

import vector1 from "../../assets/img/et-3-event-vector.svg";
import vector2 from "../../assets/img/et-3-event-vector-2.svg";

import { formatEuro, getFormattedDayAndMonthYear, capitalizeFirstLetter } from '../../utils/format';

import ParticipantAvatars from './ParticipantAvatars';

import useCategories from '../../hooks/Categorie/useCategories';
import useEvents from '../../hooks/Events/useEvents';
import useFavoris from '../../hooks/Favoris/useFavoris';
import useAddFavoris from '../../hooks/Favoris/useAddFavoris';

import { removeFavoris } from '../../services/favorisService';
import { useAuth } from '../../config/authHeader';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function EventsListEventics() {
    useSlideUpAnimation();
    useTextAnimation();

    const { categories: allCategories, loading: catLoading } = useCategories();
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const displayedCategories = allCategories.slice(0, 3);

    const { user, isAuthenticated } = useAuth();
    const { favoris, loading: favLoading, error, refreshFavoris } = useFavoris();
    const { add } = useAddFavoris();

    useEffect(() => {
        if (allCategories.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(allCategories[0].id);
        }
    }, [allCategories]);

    const filters = useMemo(() => {
        return selectedCategoryId ? { categoryId: selectedCategoryId } : {};
    }, [selectedCategoryId]);

    const { events, loading: eventsLoading } = useEvents(filters, 1, 10);

    useSlideUpAnimation('.rev-slide-up', events);
    useTextAnimation();

    const isFavoris = (eventId) => favoris.some((f) => f.id_event === eventId);

    const showToast = (title, icon = 'success') => {
        Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon,
            title,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#fff',
            color: '#333',
            customClass: {
                popup: 'shadow-lg rounded-lg animate__animated animate__fadeInUp'
            }
        });
    };

    const toggleFavoris = async (eventId) => {
        if (!isAuthenticated) {
            showToast('Vous devez être connecté pour ajouter un favori', 'warning');
            return;
        }

        try {
            if (isFavoris(eventId)) {
                await removeFavoris(eventId, user.token);
                showToast('Événement retiré des favoris');
            } else {
                await add(eventId);
                showToast('Événement ajouté aux favoris');
            }
            await refreshFavoris();
        } catch (err) {
            showToast(err.message || 'Erreur', 'error');
        }
    };

    return (
        <section className="z-[1] relative py-[120px] md:py-[60px] xl:py-[80px] overflow-hidden">
            <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full">
                <div className="mb-[60px] md:mb-[40px] pb-[60px] md:pb-[40px] border-[#8E8E93]/25 border-b">
                    <h6 className="after:top-[46%] after:right-0 after:absolute mx-auto pr-[45px] w-max after:w-[30px] max-w-full after:h-[5px] anim-text et-3-section-sub-title">
                        Upcoming Event
                    </h6>
                    <h2 className="mb-[26px] text-center anim-text et-3-section-title">Upcoming Events</h2>

                    <div className="*:before:-z-[1] *:z-[1] *:before:absolute *:relative *:before:inset-0 flex flex-wrap justify-center gap-[30px] xxs:gap-[15px] *:before:bg-gradient-to-r *:before:from-[#550ECA] *:before:to-[#F929BB] *:before:opacity-0 *:px-[25px] *:border *:border-[#8E8E93] *:h-[30px] *:text-[17px] et-3-event-tab-navs">
                        {displayedCategories.map((cat, i) => (
                            <button
                                key={cat.id}
                                className={`tab-nav ${selectedCategoryId === cat.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategoryId(cat.id)}
                                data-tab={`et-3-event-${i + 1}-tab`}
                            >
                                {capitalizeFirstLetter(cat.name)}
                            </button>
                        ))}
                    </div>
                </div>

                {catLoading || eventsLoading ? (
                    <>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rev-slide-up">
                                <SkeletonEventCard />
                            </div>
                        ))}
                    </>
                ) : events.length === 0 ? (
                    <p className="text-lg text-center">Aucun événement trouvé.</p>
                ) : (
                    events.map((event, index) => {
                        const mainImage = event.EventImages?.find(img => img.is_main) || event.EventImages?.[0];
                        const imageUrl = mainImage?.image_url?.startsWith('http')
                            ? mainImage.image_url
                            : `${API_BASE_URL}${mainImage?.image_url || ''}`;

                        return (
                            <div key={index} className="relative flex lg:flex-wrap flex-nowrap items-center gap-[40px] opacity-1 py-[30px] border-[#8E8E93]/25 border-b rev-slide-up">

                                {isAuthenticated && (
                                    <div
                                        className={`absolute top-3 right-3 cursor-pointer text-xl transition-all duration-300 transform 
                                        ${isFavoris(event.id) ? 'text-red-600 hover:scale-110' : 'text-gray-400 hover:scale-110'}`}
                                        onClick={() => toggleFavoris(event.id)}
                                    >
                                        {isFavoris(event.id) ? (
                                            <FaHeart className="animate-pulse" />
                                        ) : (
                                            <FaRegHeart />
                                        )}
                                    </div>
                                )}  

                                <h5 className="w-[120px] text-[24px] text-etBlue text-center shrink-0">
                                    <span className="block font-semibold text-[48px] text-etBlack leading-[0.7]">
                                        {getFormattedDayAndMonthYear(event.start_time).day}
                                    </span>
                                    {getFormattedDayAndMonthYear(event.start_time).monthYear}
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
                                        <Link to={`/event/${event.id}`}>
                                            <h3 className="mb-[11px] font-semibold text-[30px] text-etBlack hover:text-etBlue truncate tracking-[-1px] transition-all duration-300 cursor-pointer anim-text">
                                                {capitalizeFirstLetter(event.title)}
                                            </h3>
                                        </Link>
                                        <h6 className="text-[17px] text-etBlue">
                                            <span><i className="mr-2 fas fa-map-marker-alt"></i></span>
                                            {capitalizeFirstLetter(event.city)}, {event.street_number} {event.street}
                                        </h6>
                                        <div className={`text-xs font-semibold px-3 py-1 rounded-full w-fit mt-2
											${event.status === 'Planifié' ? 'bg-blue-100 text-blue-700' : ''}
											${event.status === 'En Cours' ? 'bg-green-100 text-green-700' : ''}
											${event.status === 'Terminé' ? 'bg-gray-200 text-gray-700' : ''}
											${event.status === 'Annulé' ? 'bg-red-100 text-red-700' : ''}
										`}>{event.status}
                                        </div>
                                    </div>
                                    <h4 className="ml-auto font-semibold text-[30px] text-etBlue whitespace-nowrap">
                                        {formatEuro(event.price)}
                                    </h4>
                                </div>
                                <div className="pl-[40px] border-[#8E8E93]/25 border-l text-center shrink-0">
                                    <ParticipantAvatars eventId={event.id} />

                                    <Link to={`/event/${event.id}`} className="et-3-btn">
                                        Voir l'event
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* VECTORS + BACKGROUND */}
            <div className="*:-z-[1] *:absolute">
                <h3 className="xl:hidden bottom-[120px] left-[68px] xxl:left-[8px] et-outlined-text h-max font-bold text-[65px] uppercase tracking-widest -scale-[1] anim-text et-vertical-txt">upcoming events</h3>
                <div className="-top-[195px] -left-[519px] bg-gradient-to-b from-etPurple to-etPink blur-[230px] rounded-full w-[688px] aspect-square"></div>
                <div className="-right-[319px] bottom-[300px] bg-gradient-to-b from-etPink to-etPink blur-[230px] rounded-full w-[588px] aspect-square"></div>
                <img src={vector1} alt="vector" className="top-0 left-0 opacity-25" />
                <img src={vector1} alt="vector" className="right-0 bottom-0 opacity-25 rotate-180" />
                <img src={vector2} alt="vector" className="top-[33px] -right-[175px] animate-[etSpin_7s_linear_infinite]" />
            </div>
        </section>
    );
}

export default EventsListEventics;