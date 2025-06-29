import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import Swal from 'sweetalert2';

import '../assets/css/style.css';

import Header from "../components/Partials/Header";
import Footer from '../components/Partials/Footer';

import useSlideUpAnimation from '../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../hooks/Animations/useTextAnimation';

import vector1 from "../assets/img/et-3-event-vector.svg";
import vector2 from "../assets/img/et-3-event-vector-2.svg";

import AboutClub from '../components/Home/AboutClub';
import Team from '../components/Home/Team';
import Contact from '../components/AboutUs/Contact';

function AboutUs() {
    useSlideUpAnimation();
    useTextAnimation();

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
                            <li className="current-page anim-text">À Propos de Nous</li>
                        </ul>
                    </div>
                </section>


                <AboutClub />

                <Team />

                <Contact />


                {/* <section className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full">
                    <div className="mb-[60px] md:mb-[40px] pb-[60px] md:pb-[40px] border-[#8E8E93]/25 border-b">
                        <h6 className="after:top-[46%] after:right-0 after:absolute mx-auto pr-[45px] w-max after:w-[30px] max-w-full after:h-[5px] anim-text et-3-section-sub-title">
                            Ne manquez pas ça !
                        </h6>
                        <h2 className="mb-[26px] text-center anim-text et-3-section-title">À l’affiche prochainement</h2>

                        <div className="*:before:-z-[1] *:z-[1] *:before:absolute *:relative *:before:inset-0 flex flex-wrap justify-center gap-[30px] xxs:gap-[15px] *:before:bg-gradient-to-r *:before:from-[#550ECA] *:before:to-[#F929BB] *:before:opacity-0 *:px-[25px] *:border *:border-[#8E8E93] *:h-[30px] *:text-[17px] et-3-event-tab-navs">
                            <CustomSelect
                                name="category"
                                value={selectedCategoryName || 'Tous'}
                                onChange={(e) => {
                                    const selectedName = e.target.value;
                                    const matched = allCategories.find(cat => capitalizeFirstLetter(cat.name) === selectedName);
                                    setSelectedCategoryId(matched ? matched.id : null);
                                }}
                                options={categoryOptions}
                                placeholder="Catégorie"
                            />
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
                                                    alt="Image de l'événement"
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
                                                    <EventStatusTag date={event.start_time} status={event.status} />
                                                </div>
                                                <h4 className="ml-auto font-semibold text-[30px] text-etBlue whitespace-nowrap">
                                                    {formatEuro(event.price)}
                                                </h4>
                                            </div>

                                            <div className="pl-[40px] border-[#8E8E93]/25 border-l text-center shrink-0">
                                                <ParticipantAvatars eventId={event.id} />
                                                <Link to={`/event/${event.id}`} className="et-3-btn">
                                                    Voir l'événement
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>

                        )

                    })()}

                </section> */}
            </main>
            <Footer />
        </>

    );
}

export default AboutUs;