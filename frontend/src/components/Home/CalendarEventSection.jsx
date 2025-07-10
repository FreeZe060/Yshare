import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import '../../assets/css/style.css';
import useSlideUpAnimation from '../../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../../hooks/Animations/useTextAnimation';

import EventStatusTag from '../../components/Events/EventStatusTag';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';

import { formatEuro, formatDate, capitalizeFirstLetter } from '../../utils/format';

import eventBgImage from "../../assets/img/et-3-calender-event.jpg";
import eventArrowIcon from "../../assets/img/arrow-down-right.svg";
import fallbackImage from "../../assets/img/et-3-event-1.jpg";

import ReportDropdown from '../Report/ReportDropdown';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function CalendarEventSection({ events }) {
    const displayedEvents = events.slice(0, 10);
    const [activeIndex, setActiveIndex] = useState(0);

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
                        <h6 className="anim-text et-3-section-sub-title">Calendrier Event</h6>
                        <h2 className="anim-text et-3-section-title">Vivez les meilleurs événements</h2>
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
                                : `${mainImage?.image_url || ''}`;

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
                                            <div className="bg-white xxs:!p-[30px] px-0 xs:px-[40px] group-[.active]:px-[40px] py-[35px] overflow-hidden duration-[400ms]">
                                                <div className="w-[392px] xxs:w-[230px] sm:w-[342px]">
                                                    <ReportDropdown
                                                        contextType="event"
                                                        eventId={event.id}
                                                        organizerId={event.id_org}
                                                    />
                                                    <span className="inline-block opacity-25 mb-[8px] et-outlined-text font-semibold text-[48px] leading-[0.7]">
                                                        {(index + 1).toString().padStart(2, '0')}
                                                    </span>
                                                    <h3 className="font-semibold text-[30px] text-black sm:text-[28px] line-clamp-2">
                                                        <a>{event.title.toUpperCase()}</a>
                                                    </h3>
                                                    <EventStatusTag date={event.start_time} status={event.status} />

                                                    <h6 className="mb-[10px] font-normal text-[#CE22BF] text-[17px]">{formatDate(event.start_time, "long")}</h6>
                                                    <h3 className="mb-[10px] font-semibold text-[#CE22BF] text-[30px]">{formatEuro(event.price)}</h3>
                                                    <p className="mb-[19px] text-[17px] text-etGray line-clamp-2">
                                                        {event.description}
                                                    </p>
                                                    <div className="flex items-start text-[#CE22BF] text-[17px]">
                                                        <span><i class="mr-2 fa-solid fa-location-dot"></i></span>
                                                        <h6 className="text-[17px] text-gray-600">
                                                            {capitalizeFirstLetter(event.city)}, {event.street_number} {event.street}
                                                        </h6>
                                                    </div>

                                                    <Link to={`/event/${event.id}`} className="mt-3 cursor-pointer et-3-btn">
                                                        Voir l'event
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="xs:hidden relative overflow-hidden">
                                                <img
                                                    src={imageUrl || fallbackImage}
                                                    alt="event image"
                                                    className="w-full h-[500px] sm:max-h-[482px] object-cover"
                                                />

                                                <div className="bottom-[30px] left-[30px] absolute text-white transition-transform group-[.active]:translate-x-2 duration-[400ms]">
                                                    <h5 className="mb-[4px] font-semibold text-[22px] uppercase leading-none">
                                                        {event.title}
                                                    </h5>
                                                    <h6 className="text-[17px] leading-none">
                                                        {formatDate(event.start_time, "long")}
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