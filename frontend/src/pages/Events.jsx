import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Swal from 'sweetalert2';

import '../assets/css/style.css';

import Header from "../components/Partials/Header";
import Footer from '../components/Partials/Footer';
import CustomSelect from '../utils/CustomSelect';

import useSlideUpAnimation from '../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../hooks/Animations/useTextAnimation';
import EventStatusTag from '../utils/EventStatusTag';

import SkeletonEventCard from '../components/SkeletonLoading/SkeletonEventCard';
import vector1 from "../assets/img/et-3-event-vector.svg";
import vector2 from "../assets/img/et-3-event-vector-2.svg";

import { formatEuro, getFormattedDayAndMonthYear, capitalizeFirstLetter } from '../utils/format';

import ParticipantAvatars from '../components/Home/ParticipantAvatars';

import CardEvent from '../components/Events/CardEvent';

import useCategories from '../hooks/Categorie/useCategories';
import useEvents from '../hooks/Events/useEvents';
import useFavoris from '../hooks/Favoris/useFavoris';
import useAddFavoris from '../hooks/Favoris/useAddFavoris';

import useRemoveFavoris from '../hooks/Favoris/useRemoveFavoris';
import { useAuth } from '../config/authHeader';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

function Events() {
    useSlideUpAnimation();
    useTextAnimation();

    const { categories: allCategories, loading: catLoading } = useCategories();
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const categoryOptions = ['Tous', ...allCategories.slice(0, 3).map(cat => capitalizeFirstLetter(cat.name))];

    const [selectedPrice, setSelectedPrice] = useState('Tous');
    const [selectedDate, setSelectedDate] = useState('Tous');
    const [selectedSort, setSelectedSort] = useState('Tous');
    const [selectedCity, setSelectedCity] = useState('');

    const { user, isAuthenticated } = useAuth();
    const { favoris, loading: favLoading, error, refreshFavoris } = useFavoris();
    const [refreshKey, setRefreshKey] = useState(0);
    const { add } = useAddFavoris();
    const { remove } = useRemoveFavoris();

    const selectedCategoryName = categoryOptions.find((_, idx) => idx === (selectedCategoryId === null ? 0 : allCategories.findIndex(cat => cat.id === selectedCategoryId) + 1));

    const filters = useMemo(() => {
        const query = {};

        if (selectedCategoryId !== null) {
            query.categoryId = selectedCategoryId;
        }

        if (selectedCity) {
            query.city = selectedCity;
        }

        const today = new Date();

        if (selectedDate === "Aujourd’hui") {
            query.date = today.toISOString().split("T")[0];
        } else if (selectedDate === "Cette semaine") {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            query.date = startOfWeek.toISOString().split("T")[0];
        } else if (selectedDate === "Ce mois") {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            query.date = startOfMonth.toISOString().split("T")[0];
        }

        if (selectedSort === "Les plus récents") {
            query.sort = "start_time_desc";
        } else if (selectedSort === "Populaires") {
            query.sort = "popularity"; // à gérer dans le backend
        }

        return query;
    }, [selectedCategoryId, selectedCity, selectedDate, selectedSort]);


    const { events, loading: eventsLoading } = useEvents(filters, 1, 100, true, refreshKey);

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

    const { events: allEvents } = useEvents(undefined, 1, 100, true, refreshKey);
    const totalUpcomingEvents = useMemo(() => {
        return allEvents?.filter(event => new Date(event.start_time) > new Date()).length || 0;
    }, [allEvents]);

    return (
        <>
            <Header />
            <main className="">
                <section style={{
                    backgroundImage: `linear-gradient(to top right, #580FCA, #F929BB), url(${vector1})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundBlendMode: 'overlay',
                }}
                    className="z-[1] before:-z-[1] before:absolute relative bg-gradient-to-tr from-[#580FCA] to-[#F929BB] before:bg-cover before:bg-center before:opacity-30 pt-[210px] sm:pt-[160px] lg:pt-[190px] pb-[130px] sm:pb-[80px] lg:pb-[110px] et-breadcrumb">
                    <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full text-white text-center container">
                        <h1 className="font-medium text-[56px] xs:text-[45px] md:text-[50px] et-breadcrumb-title anim-text">Tous les événements</h1>
                        <ul className="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li className="opacity-80"><a href="/" className="hover:text-[#C320C0] anim-text">Home</a></li>
                            <li><i className="fa-angle-right fa-solid"></i><i className="fa-angle-right fa-solid"></i></li>
                            <li className="current-page anim-text">Tous les événements</li>
                        </ul>
                    </div>
                </section>


                <section className="z-[1] relative py-[120px] md:py-[60px] xl:py-[80px] overflow-hidden">
                    <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full">
                        <div className="mb-[60px] md:mb-[40px] pb-[60px] md:pb-[40px] border-[#8E8E93]/25 border-b">
                            <h6 className="after:top-[46%] after:right-0 after:absolute mx-auto pr-[45px] w-max after:w-[30px] max-w-full after:h-[5px] anim-text et-3-section-sub-title">
                                Ne manquez pas ça !
                            </h6>
                            <h2 className="mb-[26px] text-center anim-text et-3-section-title">À l’affiche prochainement</h2>

                            <div className="flex flex-col flex-wrap justify-center gap-4 bg-white shadow px-4 py-2 rounded-xl">
                                <div className="w-full sm:w-[48%] md:w-[23%]">
                                    <CustomSelect
                                        label="Catégorie"
                                        options={categoryOptions}
                                        value={selectedCategoryName}
                                        onChange={(val) => {
                                            if (val === 'Tous') {
                                                setSelectedCategoryId(null);
                                            } else {
                                                const cat = allCategories.find((c) => capitalizeFirstLetter(c.name) === val);
                                                if (cat) setSelectedCategoryId(cat.id);
                                            }
                                        }}
                                    />
                                </div>

                                <div className="w-full sm:w-[48%] md:w-[23%]">
                                    <CustomSelect
                                        label="Prix"
                                        options={['Tous', 'Gratuit', 'Payant']}
                                        value={selectedPrice}
                                        onChange={(val) => setSelectedPrice(val)}
                                    />
                                </div>

                                <div className="w-full sm:w-[48%] md:w-[23%]">
                                    <CustomSelect
                                        label="Date"
                                        options={['Tous', 'Aujourd’hui', 'Cette semaine', 'Ce mois']}
                                        value={selectedDate}
                                        onChange={(val) => setSelectedDate(val)}
                                    />
                                </div>

                                <div className="w-full sm:w-[48%] md:w-[23%]">
                                    <CustomSelect
                                        label="Popularité"
                                        options={['Tous', 'Populaires', 'Les plus récents']}
                                        value={selectedSort}
                                        onChange={(val) => setSelectedSort(val)}
                                    />
                                </div>
                            </div>
                        </div>

                        {catLoading || eventsLoading ? (
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="rev-slide-up">
                                    <SkeletonEventCard />
                                </div>
                            ))
                        ) : (() => {

                            if (events.length === 0) {
                                return (
                                    <div className="mt-10 text-center animate__animated animate__fadeIn">
                                        <p className="bg-clip-text bg-gradient-to-r from-[#550ECA] to-[#F929BB] font-semibold text-[20px] text-transparent">
                                            Aucun événement à venir pour le moment.
                                        </p>
                                        <p className="mt-2 text-gray-500 text-sm">Restez connecté, de nouvelles expériences arrivent bientôt !</p>
                                    </div>
                                );
                            }

                            return (
                                <>
                                    {events.map((event, index) => {
                                        const mainImage = event.EventImages?.find(img => img.is_main) || event.EventImages?.[0];
                                        const imageUrl = mainImage?.image_url?.startsWith('http')
                                            ? mainImage.image_url
                                            : `${API_BASE_URL}${mainImage?.image_url || ''}`;

                                        return (
                                            <CardEvent
                                                key={event.id}
                                                event={event}
                                                isAuthenticated={isAuthenticated}
                                                isFavoris={isFavoris}
                                                toggleFavoris={toggleFavoris}
                                            />
                                        );
                                    })}
                                </>

                            )

                        })()}
                    </div>


                    <div className="*:-z-[1] *:absolute">
                        <h3 className="xl:hidden bottom-[120px] left-[68px] xxl:left-[8px] et-outlined-text h-max font-bold text-[65px] uppercase tracking-widest -scale-[1] anim-text et-vertical-txt">upcoming events</h3>
                        <div className="-top-[195px] -left-[519px] bg-gradient-to-b from-etPurple to-etPink blur-[230px] rounded-full w-[688px] aspect-square"></div>
                        <div className="-right-[319px] bottom-[300px] bg-gradient-to-b from-etPink to-etPink blur-[230px] rounded-full w-[588px] aspect-square"></div>
                        <img src={vector1} alt="vector" className="top-0 left-0 opacity-25" />
                        <img src={vector1} alt="vector" className="right-0 bottom-0 opacity-25 rotate-180" />
                        <img src={vector2} alt="vector" className="top-[33px] -right-[175px] animate-[etSpin_7s_linear_infinite]" />
                    </div>

                </section>
            </main>
            <Footer />
        </>

    );
}

export default Events;