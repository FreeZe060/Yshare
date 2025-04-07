import React, { useState } from 'react';

import '../assets/css/style.css';
import useSlideUpAnimation from '../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../hooks/Animations/useTextAnimation';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';

import { formatEuro, formatDate, capitalizeFirstLetter } from '../utils/format';

import eventBgImage from "../assets/img/et-3-calender-event.jpg";
import eventArrowIcon from "../assets/img/arrow-down-right.svg";
import fallbackImage from "../assets/img/et-3-event-1.jpg";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function CalendarEventSection({ events }) {
    const displayedEvents = events.slice(0, 10);
    const [activeIndex, setActiveIndex] = useState(null);

    useSlideUpAnimation();
    useTextAnimation();

    return (    
        
        <section
            className="bg-cover bg-no-repeat bg-center py-[120px] md:py-[60px] xl:py-[80px] overflow-hidden"
            style={{ backgroundImage: `url(${eventBgImage})` }}
        >
            <div className="mx-[10.4vw] xxs:mx-[4.8vw] sm:mx-[7vw]">
                <div className="flex justify-between items-end gap-[20px] mb-[60px]">
                    <div className="text-white">
                        <h6 className="anim-text et-3-section-sub-title">Calender Event</h6>
                        <h2 className="anim-text et-3-section-title">Experience the Best Events in Town</h2>
                    </div>
                    <div className="shrink-0">
                        <a
                            href="#"
                            className="before:z-[0] before:absolute relative before:-inset-[30px] flex justify-center items-center bg-white before:bg-no-repeat m-[30px] rounded-full w-[56px] aspect-square before:animate-[etSpin_7s_infinite_linear_forwards]"
                        >
                            <img src={eventArrowIcon} alt="icon" />
                        </a>
                    </div>
                </div>

                {/* SLIDER */}
                <div className="overflow-visible et-3-event-slider swiper rev-slide-up">
                    <Swiper
                        modules={[Autoplay]}
                        slidesPerView="auto"
                        spaceBetween={30}
                        loop={true}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: true,
                        }}
                        speed={500}
                        allowTouchMove={true}
                    >
                        {displayedEvents.map((event, index) => {
                            const mainImage = event.EventImages?.find(img => img.is_main) || event.EventImages?.[0];
                            const imageUrl = mainImage?.image_url?.startsWith('http')
                                ? mainImage.image_url
                                : `${API_BASE_URL}${mainImage?.image_url || ''}`;

                            return (
                                <SwiperSlide
                                    key={index}
                                    style={{ width: 'auto', transition: 'width 0.5s ease' }}
                                    className=""
                                >
                                    <div className={`group w-max et-3-cal-event ${activeIndex === index ? 'active' : ''}`}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onMouseLeave={() => setActiveIndex(null)}>
                                        <div className="grid grid-cols-[0fr_242px] xs:grid-cols-[1fr_0] xs:group-[.active]:grid-cols-[1fr_0] group-[.active]:grid-cols-[1fr_362px] duration-[400ms]">
                                            <div className="group-[.active]:px-[40px] bg-white xxs:!p-[30px] px-0 xs:px-[40px] py-[35px] overflow-hidden duration-[400ms]">
                                                <div className="w-[392px] xxs:w-[230px] sm:w-[342px]">
                                                    <span className="inline-block opacity-25 mb-[8px] et-outlined-text font-semibold text-[48px] leading-[0.7]">{(index + 1).toString().padStart(2, '0')}</span>
                                                    <h3 className="font-semibold text-[30px] text-black sm:text-[28px] truncate">
                                                        <a href="event-details.html">{event.title.toUpperCase()}</a>
                                                    </h3>
                                                    <h6 className="mb-[10px] font-normal text-[17px] text-etBlue">{formatDate(event.date, "long")}</h6>
                                                    <h3 className="mb-[10px] font-semibold text-[30px] text-etBlue">{formatEuro(event.price)}</h3>
                                                    <p className="mb-[19px] text-[17px] text-etGray line-clamp-3">
                                                        {event.description}
                                                    </p>
                                                    <div className="flex items-start text-[17px] text-etBlue">
                                                        <span><i class="fa-solid fa-location-dot"></i></span>
                                                        <h6 className="text-[17px] text-gray-600">
                                                            {capitalizeFirstLetter(event.city)}, {event.street_number} {event.street} 
                                                        </h6>
                                                    </div>

                                                    <p className="text-[16px] text-gray-600 mt-3">
                                                        Participants : {event.participants?.length || 0}/{event.max_participants || 0}
                                                    </p>

                                                    <p className="text-[16px] text-gray-600">
                                                        Commentaires : {event.comments?.length || 0}
                                                    </p>

                                                    <a className="et-3-btn mt-3 cursor-pointer">
                                                        <span className="icon">
                                                            <svg width="27" height="16" viewBox="0 0 27 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M8.02101 0H0.844661C0.378197 0 0 0.378144 0 0.844662V5.12625C0 5.59277 0.378197 5.97091 0.844661 5.97091C1.96347 5.97091 2.8737 6.88114 2.8737 8C2.8737 9.11886 1.96347 10.029 0.844661 10.029C0.378197 10.029 0 10.4071 0 10.8736V15.1553C0 15.6218 0.378197 15.9999 0.844661 15.9999H8.02101V0Z" className="fill-white transition"></path>
                                                                <path d="M26.0001 5.97091C26.4665 5.97091 26.8447 5.59277 26.8447 5.12625V0.844662C26.8447 0.378144 26.4665 0 26.0001 0H9.71094V16H26.0001C26.4665 16 26.8447 15.6219 26.8447 15.1553V10.8737C26.8447 10.4072 26.4665 10.029 26.0001 10.029C24.8813 10.029 23.971 9.11886 23.971 8C23.971 6.88114 24.8813 5.97091 26.0001 5.97091Z" className="fill-white transition"></path>
                                                            </svg>
                                                        </span>
                                                        Get Tickets
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="xs:hidden relative overflow-hidden">
                                                <img
                                                    src={imageUrl || fallbackImage}
                                                    alt="event image"
                                                    className="w-full h-full max-h-[460px] sm:max-h-[482px] object-cover"
                                                />

                                                <div className="absolute bottom-[30px] left-[30px] text-white transition-transform duration-[400ms] group-[.active]:translate-x-2">
                                                    <h5 className="mb-[4px] font-semibold text-[22px] leading-none uppercase">
                                                        {event.title}
                                                    </h5>
                                                    <h6 className="text-[17px] leading-none">
                                                        {formatDate(event.date, "long")}
                                                    </h6>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                    })}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}

export default CalendarEventSection;
