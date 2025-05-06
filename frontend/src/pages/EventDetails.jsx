import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

import useSlideUpAnimation from '../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../hooks/Animations/useTextAnimation';

import useEventDetails from '../hooks/Events/useEventDetails';
import useComments from '../hooks/Comments/useComments';

import vector1 from "../assets/img/et-3-event-vector.svg";
import vector2 from "../assets/img/et-3-event-vector-2.svg";

import soiree from '../assets/img/soiree.jpg';

import { formatEuro, getFormattedDayAndMonthYear, capitalizeFirstLetter } from '../utils/format';

function EventDetails() {
    useSlideUpAnimation();
    useTextAnimation();

    const { eventId } = useParams();
    const { event, loading, error } = useEventDetails(eventId);
    const { comments } = useComments(eventId);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    // if (loading) return <p className="mt-10 text-center">Chargement...</p>;
    if (error) return <p className="mt-10 text-red-600 text-center">Erreur: {error}</p>;

    console.log(event);
    const mainImage = event?.EventImages?.find(img => img.is_main) || event?.EventImages?.[0];
    const mainImageUrl = mainImage?.image_url?.startsWith('http')
        ? mainImage.image_url
        : `${API_BASE_URL}${mainImage?.image_url || ''}`;

    const address = `${event?.street_number || ''} ${event?.street}, ${event?.postal_code} ${event?.city}`;
    const googleMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

    return (
        <>
            <Header />

            <main>
                <section style={{
                    backgroundImage: `linear-gradient(to top right, #580FCA, #F929BB), url(${vector1})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundBlendMode: 'overlay',
                }}
                    class="z-[1] before:-z-[1] before:absolute relative bg-gradient-to-tr from-[#580FCA] to-[#F929BB] before:bg-cover before:bg-center before:opacity-30 pt-[210px] sm:pt-[160px] lg:pt-[190px] pb-[130px] sm:pb-[80px] lg:pb-[110px] et-breadcrumb">
                    <div class="mx-auto px-[12px] max-w-[1200px] xl:max-w-full text-white text-center container">
                        <h1 class="font-medium text-[56px] xs:text-[45px] md:text-[50px] et-breadcrumb-title anim-text">Event Details</h1>
                        <ul class="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li class="opacity-80"><a href="index.html" class="hover:text-[#C320C0] anim-text">Home</a></li>
                            <li><i class="fa-angle-right fa-solid"></i><i class="fa-angle-right fa-solid"></i></li>
                            <li class="current-page anim-text">Event Details</li>
                        </ul>
                    </div>
                </section>

                <section className="z-[1] relative overflow-hidden">


                    <div class="py-[130px] md:py-[60px] lg:py-[80px] et-event-details-content">
                        <div class="mx-auto px-[12px] max-w-[1200px] xl:max-w-full container">

                            <div className="flex md:flex-row flex-col justify-between items-start md:items-end gap-4 mb-12 pb-8 border-[#e5e5e5] border-b">
                                <div class="flex flex-row justify-between items-center gap-2 w-full">
                                    <h1 className="font-bold text-[42px] text-etBlack xs:text-[32px] leading-tight">
                                        {capitalizeFirstLetter(event?.title)}
                                    </h1>
                                    <span
                                        className={`
                                            px-[10px] py-[4px] text-[16px] rounded-full font-medium
                                            ${event?.status === 'En Cours' && 'bg-green-100 text-green-600'}
                                            ${event?.status === 'Terminé' && 'bg-yellow-100 text-pink-700'}
                                            ${event?.status === 'Annulé' && 'bg-red-100 text-red-600'}
                                        `}
                                    >
                                        {event?.status || 'Statut inconnu'}
                                    </span>

                                </div>

                                {/* Infos date + status */}
                                <div className="flex flex-col items-end gap-2 text-right">
                                    <p className="mt-2 font-light text-[16px] text-etGray">
                                        Créé par <span className="font-medium text-[#C320C0]">Yshare Team</span>
                                    </p>
                                    <div>
                                        <p className="text-[14px] text-etGray">Quand</p>
                                        <p className="font-medium text-[18px] text-etBlack">
                                            {new Date(event?.date).toLocaleDateString("fr-FR", {
                                                weekday: "long",
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>

                                    {/* Badge status */}

                                </div>
                            </div>


                            <div class="flex md:flex-col md:items-center gap-[30px] lg:gap-[20px]">
                                <div class="left">
                                    <div class="relative rounded-[8px] overflow-hidden rev-slide-up">
                                        <img src={mainImageUrl || soiree} alt="event-details-img" class="bg-cover" />
                                        <span class="inline-block top-[20px] left-[20px] absolute bg-[#C320C0] px-[12px] py-[5px] rounded-[6px] font-normal text-[16px] text-white">Hall No: 59</span>
                                    </div>

                                    <div class="rev-slide-up">
                                        <h4 class="mt-[27px] mb-[11px] font-medium text-[30px] text-etBlack xs:text-[25px] xxs:text-[22px]">Indoor Concerts</h4>

                                        <p class="mb-[15px] font-light text-[16px] text-etGray">Consectetur adipisicing elit, sed do eiusmod tempor is incididunt ut labore et dolore of magna aliqua. Ut enim ad minim veniam, made of owl the quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea dolor commodo consequat. Duis aute irure and dolor in reprehenderit.</p>

                                        <p class="font-light text-[16px] text-etGray">The is ipsum dolor sit amet consectetur adipiscing elit. Fusce eleifend porta arcu In hac augu ehabitasse the is platea augue thelorem turpoi dictumst. In lacus libero faucibus at malesuada sagittis placerat eros sed istincidunt augue ac ante rutrum sed the is sodales augue consequat.</p>

                                        <h4 class="mt-[19px] mb-[11px] font-medium text-[30px] text-etBlack xs:text-[25px] xxs:text-[22px]">Requirements for the event</h4>

                                        <p class="mb-[21px] font-light text-[16px] text-etGray">Nulla facilisi. Vestibulum tristique sem in eros eleifend imperdiet. Donec quis convallis neque. In id lacus pulvinar lacus, eget vulputate lectus. Ut viverra bibendum lorem, at tempus nibh mattis in. Sed a massa eget lacus consequat auctor.</p>

                                        <ul class="gap-[20px] xxs:gap-[10px] grid grid-cols-2 xxs:grid-cols-1 font-light text-[16px] text-etGray et-event-details-requirements-list">
                                            <li>Ut viverra bibendum lorem, at tempus nibh</li>
                                            <li>Duis aute irure and dolor in reprehenderit.</li>
                                            <li>quis nostrud exercitation ullamco laboris nisi</li>
                                            <li>ante rutrum sed the is sodales augue</li>
                                        </ul>

                                        <div class="gap-[30px] lg:gap-[20px] grid grid-cols-2 xxs:grid-cols-1 mt-[38px] mb-[33px]">
                                            <img src={soiree} alt="event-details-img" class="rounded-[8px] w-full max-h-[306px] object-cover" />
                                            <img src={soiree} alt="event-details-img" class="rounded-[8px] w-full max-h-[306px] object-cover" />
                                        </div>

                                        <p class="mb-[43px] font-light text-[16px] text-etGray">Consectetur adipisicing elit, sed do eiusmod tempor is incididunt ut labore et dolore of magna aliqua. Ut enim ad minim veniam, made of owl the quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea dolor commodo consequat. Duis aute irure and dolor in reprehenderit.</p>
                                    </div>

                                    <div class="flex xxs:flex-col items-center gap-[20px] py-[24px] border-[#d9d9d9] border-y rev-slide-up">
                                        <a href="#" class="inline-flex items-center gap-[10px] bg-[#C320C0] hover:bg-white px-[20px] border-[#C320C0] border-2 rounded-full h-[50px] font-medium text-[17px] text-white hover:text-[#C320C0]">
                                            Candidater maintenant
                                            <i class="fa-arrow-right-long fa-solid"></i>
                                        </a>
                                    </div>

                                    <div class="mt-[50px] rev-slide-up">
                                        <h3 class="mb-[30px] xs:mb-[15px] font-semibold text-[30px] text-etBlack xs:text-[25px] anim-text">Event Artists</h3>

                                        <div class="flex xs:flex-col gap-x-[25px] gap-y-[10px] mb-[30px] p-[30px] lg:p-[20px] border border-[#d9d9d9] rounded-[12px]">
                                            <div class="rounded-[6px] overflow-hidden shrink-0">
                                                <img src="assets/img/artist-4.jpg" alt="Artist Image" class="w-[168px] aspect-square" />
                                            </div>

                                            <div class="grow">
                                                <div class="flex flex-wrap justify-between items-center gap-[10px] pb-[15px] border-[#d9d9d9] border-b">
                                                    <div>
                                                        <h5 class="font-semibold text-[20px] text-etBlack"><a href="#" class="hover:text-[#C320C0]">Ronald Richards</a></h5>
                                                        <span class="inline-block text-[16px] text-etGray2">Singer</span>
                                                    </div>

                                                    <div class="flex gap-[15px] text-[16px]">
                                                        <a href="#" class="text-[#757277] hover:text-[#C320C0]"><i class="fa-brands fa-facebook-f"></i></a>
                                                        <a href="#" class="text-[#757277] hover:text-[#C320C0]"><i class="fa-brands fa-twitter"></i></a>
                                                        <a href="#" class="text-[#757277] hover:text-[#C320C0]"><i class="fa-brands fa-linkedin-in"></i></a>
                                                        <a href="#" class="text-[#757277] hover:text-[#C320C0]"><i class="fa-brands fa-youtube"></i></a>
                                                    </div>
                                                </div>

                                                <p class="pt-[20px] font-light text-[16px] text-etGray2">Pellentesque pretium, mi in viverra faucibus, justo nunc dapibus lacus, sit amet consequat diam nisi eu mi. Integer diam erat, accumsan eget nisl eu, maximus feugiat odio. Proin eleifend.</p>
                                            </div>
                                        </div>

                                        <div class="flex xs:flex-col gap-x-[25px] gap-y-[10px] mb-[30px] p-[30px] lg:p-[20px] border border-[#d9d9d9] rounded-[12px]">
                                            <div class="rounded-[6px] overflow-hidden shrink-0">
                                                <img src="assets/img/artist-5.jpg" alt="Artist Image" class="w-[168px] aspect-square" />
                                            </div>

                                            <div class="grow">
                                                <div class="flex flex-wrap justify-between items-center gap-[10px] pb-[15px] border-[#d9d9d9] border-b">
                                                    <div>
                                                        <h5 class="font-semibold text-[20px] text-etBlack"><a href="#" class="hover:text-[#C320C0]">Leslie Alexander</a></h5>
                                                        <span class="inline-block text-[16px] text-etGray2">Singer</span>
                                                    </div>

                                                    <div class="flex gap-[15px] text-[16px]">
                                                        <a href="#" class="text-[#757277] hover:text-[#C320C0]"><i class="fa-brands fa-facebook-f"></i></a>
                                                        <a href="#" class="text-[#757277] hover:text-[#C320C0]"><i class="fa-brands fa-twitter"></i></a>
                                                        <a href="#" class="text-[#757277] hover:text-[#C320C0]"><i class="fa-brands fa-linkedin-in"></i></a>
                                                        <a href="#" class="text-[#757277] hover:text-[#C320C0]"><i class="fa-brands fa-youtube"></i></a>
                                                    </div>
                                                </div>

                                                <p class="pt-[20px] font-light text-[16px] text-etGray2">Pellentesque pretium, mi in viverra faucibus, justo nunc dapibus lacus, sit amet consequat diam nisi eu mi. Integer diam erat, accumsan eget nisl eu, maximus feugiat odio. Proin eleifend.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="right space-y-[30px] w-[370px] lg:w-[360px] max-w-full shrink-0">
                                    <div class="border border-[#e5e5e5] rounded-[16px] overflow-hidden et-event-details-ticket-widgget">
                                        <div class="bg-[#C320C0] p-[16px] xxs:p-[12px]">
                                            <h5 class="font-medium text-[20px] text-white text-center">Select Date and Time</h5>
                                        </div>

                                        <div class="p-[22px] lg:p-[16px]">
                                            <div class="flex justify-between items-center mt-[6px] mb-[16px]">
                                                <h6 class="font-medium text-[#232323] text-[16px]">Time Schedule</h6>

                                                <div class="flex items-center gap-[20px] text-[16px]" id="et-event-details-ticket-time-slider-nav">
                                                    <button class="hover:text-[#C320C0] prev"><i class="fa-angle-left fa-solid"></i></button>
                                                    <button class="hover:text-[#C320C0] next"><i class="fa-angle-right fa-solid"></i></button>
                                                </div>
                                            </div>

                                            <div class="mb-[24px] overflow-visible et-event-details-ticket-time-slider swiper">
                                                <div class="swiper-wrapper">
                                                    <div class="group w-max swiper-slide">
                                                        <span class="inline-flex justify-center items-center group-[.swiper-slide-active]:bg-[#C320C0] px-[15px] border border-[#e5e5e5] group-[.swiper-slide-active]:border-etBlue rounded-[4px] h-[30px] font-inter font-normal text-[#232323] text-[14px] group-[.swiper-slide-active]:text-white cursor-pointer">19:00</span>
                                                    </div>
                                                    <div class="group w-max swiper-slide">
                                                        <span class="inline-flex justify-center items-center group-[.swiper-slide-active]:bg-[#C320C0] px-[15px] border border-[#e5e5e5] group-[.swiper-slide-active]:border-etBlue rounded-[4px] h-[30px] font-inter font-normal text-[#232323] text-[14px] group-[.swiper-slide-active]:text-white cursor-pointer">19:00</span>
                                                    </div>
                                                    <div class="group w-max swiper-slide">
                                                        <span class="inline-flex justify-center items-center group-[.swiper-slide-active]:bg-[#C320C0] px-[15px] border border-[#e5e5e5] group-[.swiper-slide-active]:border-etBlue rounded-[4px] h-[30px] font-inter font-normal text-[#232323] text-[14px] group-[.swiper-slide-active]:text-white cursor-pointer">19:00</span>
                                                    </div>
                                                    <div class="group w-max swiper-slide">
                                                        <span class="inline-flex justify-center items-center group-[.swiper-slide-active]:bg-[#C320C0] px-[15px] border border-[#e5e5e5] group-[.swiper-slide-active]:border-etBlue rounded-[4px] h-[30px] font-inter font-normal text-[#232323] text-[14px] group-[.swiper-slide-active]:text-white cursor-pointer">19:00</span>
                                                    </div>
                                                    <div class="group w-max swiper-slide">
                                                        <span class="inline-flex justify-center items-center group-[.swiper-slide-active]:bg-[#C320C0] px-[15px] border border-[#e5e5e5] group-[.swiper-slide-active]:border-etBlue rounded-[4px] h-[30px] font-inter font-normal text-[#232323] text-[14px] group-[.swiper-slide-active]:text-white cursor-pointer">19:00</span>
                                                    </div>
                                                    <div class="group w-max swiper-slide">
                                                        <span class="inline-flex justify-center items-center group-[.swiper-slide-active]:bg-[#C320C0] px-[15px] border border-[#e5e5e5] group-[.swiper-slide-active]:border-etBlue rounded-[4px] h-[30px] font-inter font-normal text-[#232323] text-[14px] group-[.swiper-slide-active]:text-white cursor-pointer">19:00</span>
                                                    </div>
                                                    <div class="group w-max swiper-slide">
                                                        <span class="inline-flex justify-center items-center group-[.swiper-slide-active]:bg-[#C320C0] px-[15px] border border-[#e5e5e5] group-[.swiper-slide-active]:border-etBlue rounded-[4px] h-[30px] font-inter font-normal text-[#232323] text-[14px] group-[.swiper-slide-active]:text-white cursor-pointer">19:00</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <form class="space-y-[10px] mb-[30px]">
                                                <div class="px-[16px] py-[7px] border border-[#d9d9d9] rounded-[6px] radio-container">
                                                    <label for="schedule1" class="relative flex gap-[15px] font-normal text-[#232323] text-[14px]">
                                                        <span>posuere turpis, eget molestie Nulla at nibh et.</span>
                                                        <span class="flex items-center">
                                                            <input type="radio" id="schedule1" name="options" value="schedule1" class="appearance-none" checked />
                                                            <span class="before:top-[50%] after:top-[50%] before:right-0 after:right-0 before:-z-[1] before:absolute after:absolute before:content-normal after:content-normal before:bg-white after:bg-[#C320C0] after:opacity-0 mr-[28px] after:mr-[4px] before:border before:border-etBlue before:rounded-full after:rounded-full before:w-[16px] after:w-[8px] before:h-[16px] after:h-[8px] before:-translate-y-[50%] after:-translate-y-[50%]">15,00 €</span>
                                                        </span>
                                                    </label>
                                                </div>

                                                <div class="px-[16px] py-[7px] border border-[#d9d9d9] rounded-[6px] radio-container">
                                                    <label for="schedule2" class="relative flex gap-[15px] font-normal text-[#232323] text-[14px]">
                                                        <span>posuere turpis, eget molestie Nulla at nibh et.</span>
                                                        <span class="flex items-center">
                                                            <input type="radio" id="schedule2" name="options" value="schedule2" class="appearance-none" />
                                                            <span class="before:top-[50%] after:top-[50%] before:right-0 after:right-0 before:-z-[1] before:absolute after:absolute before:content-normal after:content-normal before:bg-white after:bg-[#C320C0] after:opacity-0 mr-[28px] after:mr-[4px] before:border before:border-etBlue before:rounded-full after:rounded-full before:w-[16px] after:w-[8px] before:h-[16px] after:h-[8px] font-normal text-[#232323] text-[14px] before:-translate-y-[50%] after:-translate-y-[50%]">13,00 €</span>
                                                        </span>
                                                    </label>
                                                </div>

                                                <div class="px-[16px] py-[7px] border border-[#d9d9d9] rounded-[6px] radio-container">
                                                    <label for="schedule3" class="relative flex gap-[15px] font-normal text-[#232323] text-[14px]">
                                                        <span>posuere turpis, eget molestie Nulla at nibh et.</span>
                                                        <span class="flex items-center">
                                                            <input type="radio" id="schedule3" name="options" value="schedule3" class="appearance-none" />
                                                            <span class="before:top-[50%] after:top-[50%] before:right-0 after:right-0 before:-z-[1] before:absolute after:absolute before:content-normal after:content-normal before:bg-white after:bg-[#C320C0] after:opacity-0 mr-[28px] after:mr-[4px] before:border before:border-etBlue before:rounded-full after:rounded-full before:w-[16px] after:w-[8px] before:h-[16px] after:h-[8px] font-normal text-[#232323] text-[14px] before:-translate-y-[50%] after:-translate-y-[50%]">14,00 €</span>
                                                        </span>
                                                    </label>
                                                </div>
                                            </form>

                                            <div class="mb-[30px] px-[80px] xxs:px-[30px] border-[#d9d9d9] border-[0.5px] rounded-full">
                                                <div class="flex justify-between items-center gap-[15px] py-[17px]">
                                                    <button type="button" id="decreaseButton" class="inline-flex justify-center items-center bg-[#C320C0]/10 hover:bg-[#C320C0] rounded-full w-[28px] aspect-square font-extralight text-[35px] hover:text-white decrease">
                                                        <span class="h-[28px] leading-[22px]">&minus;</span>
                                                    </button>
                                                    <span class="font-light text-[16px]"><span id="ticketNumber">1</span> Ticket</span>

                                                    <button type="button" id="increaseButton" class="inline-flex justify-center items-center bg-[#C320C0]/10 hover:bg-[#C320C0] rounded-full w-[28px] aspect-square font-extralight text-[35px] hover:text-white increase">
                                                        <span class="h-[28px] leading-[22px]">&plus;</span>
                                                    </button>
                                                </div>
                                            </div>


                                            <button class="flex justify-center items-center gap-x-[10px] bg-[#C320C0] hover:bg-white px-[15px] border-[#C320C0] border-2 rounded-full w-full h-[50px] text-[15px] text-white hover:text-[#C320C0]">

                                                <span>{`${event?.price > 0 ? "Candidater" : "Candidater"} (${formatEuro(event?.price)}) `}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div class="border border-[#e5e5e5] rounded-[16px]">
                                        <div class="bg-[#C320C0] p-[16px] xxs:p-[12px] rounded-t-[16px]">
                                            <h5 class="font-medium text-[17px] text-white text-center"><i className="mr-2 fas fa-map-marker-alt"></i>{address}</h5>
                                        </div>
                                        <iframe
                                            src={googleMapUrl}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            className="rounded-b-[16px] w-full h-[280px]"
                                            title="Event Location"
                                        />
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VECTORS + BACKGROUND */}
                    <div className="*:-z-[1] *:absolute">
                        <h3 className="xl:hidden top-[420px] left-[68px] xxl:left-[8px] et-outlined-text h-max font-bold text-[65px] uppercase tracking-widest -scale-[1] anim-text et-vertical-txt">Event</h3>
                        <div className="-top-[195px] -left-[519px] bg-gradient-to-b from-etPurple to-etPink blur-[230px] rounded-full w-[688px] aspect-square"></div>
                        <div className="-right-[319px] bottom-[300px] bg-gradient-to-b from-etPink to-etPink blur-[230px] rounded-full w-[588px] aspect-square"></div>
                        <img src={vector1} alt="vector" className="top-0 left-0 opacity-25" />
                        <img src={vector1} alt="vector" className="right-0 bottom-0 opacity-25 rotate-180" />
                        <img src={vector2} alt="vector" className="top-[33px] -right-[175px] animate-[etSpin_7s_linear_infinite]" />
                        <img src={vector2} alt="vector" className="top-[1033px] -left-[175px] animate-[etSpin_7s_linear_infinite]" />
                    </div>

                </section>



            </main>

            <Footer />
        </>
    );
}

export default EventDetails;
