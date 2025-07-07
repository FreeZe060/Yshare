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

import { capitalizeFirstLetter } from '../../utils/format';

import useCategories from '../../hooks/Categorie/useCategories';
import useEvents from '../../hooks/Events/useEvents';
import useEventCount from '../../hooks/Events/useEventCount';
import useFavoris from '../../hooks/Favoris/useFavoris';
import useAddFavoris from '../../hooks/Favoris/useAddFavoris';
import useRemoveFavoris from '../../hooks/Favoris/useRemoveFavoris';
import { useAuth } from '../../config/authHeader';

import CardEvent from '../Events/CardEvent';

const EventsListEventics = () => {
    useSlideUpAnimation();
    useTextAnimation();

    const { categories: allCategories, loading: catLoading } = useCategories();
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const displayedCategories = [{ id: null, name: 'Tous' }, ...allCategories.slice(0, 3)];

    const { user, isAuthenticated } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);
    const { favoris, loading: favLoading, refreshFavoris } = useFavoris(refreshKey);
    const { add } = useAddFavoris();
    const { remove } = useRemoveFavoris();

    const filters = useMemo(() => {
        return selectedCategoryId !== null ? { categoryId: selectedCategoryId } : undefined;
    }, [selectedCategoryId]);

    const { events, loading: eventsLoading } = useEvents(filters, 1, selectedCategoryId === null ? 100 : 5, true, refreshKey);
    const { count: totalUpcomingEvents, loading: countEventsLoading, error: errorCountEvents } = useEventCount();

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
                await remove(eventId);
                showToast('Événement retiré des favoris');
            } else {
                await add(eventId);
                showToast('Événement ajouté aux favoris');
            }
            await refreshFavoris();
            setRefreshKey(prev => prev + 1);
        } catch (err) {
            showToast(err.message || 'Erreur', 'error');
        }
    };

    const refreshEvents = () => {
        console.log("Refreshing events...");
        setRefreshKey(prev => prev + 1);
    };

    return (
        <section className="z-[1] relative py-[120px] md:py-[60px] xl:py-[80px] min-h-[60rem] overflow-hidden">
            <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full">
                <div className="mb-[60px] md:mb-[40px] pb-[60px] md:pb-[40px] border-[#8E8E93]/25 border-b">
                    <h6 className="after:top-[46%] after:right-0 after:absolute mx-auto pr-[45px] w-max after:w-[30px] max-w-full after:h-[5px] anim-text et-3-section-sub-title">
                        Ne manquez pas ça !
                    </h6>
                    <h2 className="mb-[26px] text-center anim-text et-3-section-title">À l’affiche prochainement</h2>

                    <div className="*:before:-z-[1] *:z-[1] *:before:absolute *:relative *:before:inset-0 flex flex-wrap justify-center gap-[30px] xxs:gap-[15px] *:before:bg-gradient-to-r *:before:from-[#550ECA] *:before:to-[#BF1FC0] *:before:opacity-0 *:px-[25px] *:border *:border-[#8E8E93] *:h-[30px] *:text-[17px] et-3-event-tab-navs">
                        {displayedCategories.map((cat) => (
                            <button
                                key={cat.id ?? 'all'}
                                className={`tab-nav ${selectedCategoryId === cat.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategoryId(cat.id)}
                            >
                                {capitalizeFirstLetter(cat.name)}
                            </button>
                        ))}
                    </div>
                </div>

                {catLoading || eventsLoading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="rev-slide-up">
                            <SkeletonEventCard />
                        </div>
                    ))
                ) : (() => {
                    const upcomingEvents = events
                        .filter(event => event.status === "Planifié")
                        .filter(event => new Date(event.start_time) > new Date())
                        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
                        .slice(0, 5);

                    if (upcomingEvents.length === 0) {
                        return (
                            <div className="mt-10 text-center animate__animated animate__fadeIn h-full flex flex-col items-center justify-center">
                                <p className="bg-clip-text bg-gradient-to-r from-[#550ECA] to-[#BF1FC0] font-semibold text-[20px] text-transparent">
                                    Aucun événement à venir pour le moment.
                                </p>
                                <p className="mt-2 text-gray-500 text-sm">Restez connecté, de nouvelles expériences arrivent bientôt !</p>
                            </div>
                        );
                    }

                    return (
                        <>
                            {upcomingEvents.map(event => (
                                <CardEvent
                                    key={event.id}
                                    event={event}
                                    isAuthenticated={isAuthenticated}
                                    isFavoris={isFavoris}
                                    toggleFavoris={toggleFavoris}
                                />
                            ))}
                            {countEventsLoading && (
                                <div className="mt-10 text-center">
                                    <Link
                                        to="/events"
                                        className="inline-block bg-clip-text bg-gradient-to-r from-[#550ECA] to-[#BF1FC0] font-medium text-[18px] text-transparent hover:underline transition-all duration-300"
                                    >
                                        + {countEventsLoading ? "" : totalUpcomingEvents} – Découvrir tous les events !
                                    </Link>
                                </div>
                            )}
                        </>
                    );
                })()}
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
};

export default EventsListEventics;
