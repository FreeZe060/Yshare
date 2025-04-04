import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const swiperStyles = {
    slide: {
        width: 'auto',
    },
};

function EventsList({ events }) {
    const displayedEvents = events.slice(0, 10);

    const onSwiperInit = (swiper) => {
        const container = swiper.el;
        if (!container) return;

        container.style.overflowX = 'auto';
        container.style.cursor = 'grab';

        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        const mouseDownHandler = (e) => {
            isDown = true;
            container.style.cursor = 'grabbing';
            startX = e.pageX - container.getBoundingClientRect().left;
            scrollLeft = container.scrollLeft;
        };

        const mouseLeaveHandler = () => {
            isDown = false;
            container.style.cursor = 'grab';
        };

        const mouseUpHandler = () => {
            isDown = false;
            container.style.cursor = 'grab';
        };

        const mouseMoveHandler = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.getBoundingClientRect().left;
            const walk = (x - startX) * 2; // ajustez le multiplicateur si nécessaire
            container.scrollLeft = scrollLeft - walk;
        };

        container.addEventListener('mousedown', mouseDownHandler);
        container.addEventListener('mouseleave', mouseLeaveHandler);
        container.addEventListener('mouseup', mouseUpHandler);
        container.addEventListener('mousemove', mouseMoveHandler);
    };

    return (
        <section className="relative mx-auto my-10 w-full max-w-[1400px]">
            <h2 className="mb-2 font-extrabold text-4xl text-left">
                CALENDER EVENT
            </h2>

            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-3xl text-left">
                    Experience the Best Events in Town
                </h3>
                <a
                    href="#"
                    className="text-pink-600 text-lg hover:underline transition-colors"
                >
                    Voir tous les events
                </a>
            </div>

            <div className="relative" style={{ marginBottom: '40px' }}>
                <Swiper
                    modules={[Pagination]}
                    slidesPerView="auto"
                    spaceBetween={20}
                    cssMode={true}
                    pagination={{ clickable: true }}
                    className="px-2 pb-20 w-full"
                    onSwiper={onSwiperInit}
                >
                    {displayedEvents.map((event) => (
                        <SwiperSlide key={event.id} style={swiperStyles.slide}>
                            <EventCard event={event} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

function EventCard({ event }) {

    const imageUrl = event.img
        ? `http://localhost:8080${event.img}`
        : 'https://via.placeholder.com/600x400';

    // console.log("event.img =", event.img);


    return (
        <div
            className="group relative bg-cover bg-center hover:shadow-2xl rounded-2xl w-[240px] hover:w-[850px] h-[400px] overflow-hidden transition-all duration-500 ease-in-out"
            style={{
                backgroundImage: `url(${imageUrl || 'https://via.placeholder.com/600x400'})`,
            }}
        >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/70 transition-colors duration-500" />

            <div className="top-1/2 right-16 absolute group-hover:opacity-0 max-w-[170px] font-bold text-white text-3xl rotate-[270deg] origin-right transition-opacity -translate-y-1/2 duration-500 transform"
            >
                <span className="block mb-2 text-2xl">{event.title || 'NO TITLE'}</span>
                {event.date && <span>{event.date}</span>}
            </div>

            <div className="hidden absolute inset-0 group-hover:flex bg-white opacity-0 group-hover:opacity-100 shadow-2xl rounded-2xl text-black transition-all duration-500 pointer-events-none group-hover:pointer-events-auto"
            >
                <div className="flex flex-col justify-center gap-6 px-10 py-8 w-1/2">
                    <h4 className="font-extrabold text-black text-6xl leading-tight">
                        {event.title || 'TITRE DE L’ÉVÉNEMENT'}
                    </h4>

                    <p className="font-bold text-blue-600 text-3xl">
                        {event.date || 'DATE NON PRÉCISÉE'}
                    </p>

                    {event.price && (
                        <p className="font-bold text-blue-500 text-3xl">${event.price}</p>
                    )}

                    {event.description && (
                        <p className="font-bold text-gray-700 text-2xl">
                            {event.description}
                        </p>
                    )}

                    {event.location && (
                        <p className="flex items-center mt-2 font-bold text-blue-600 text-xl">
                            <i class="fa-solid fa-map-pin"></i>
                            {event.location}
                        </p>
                    )}

                    {event.max_participants && (
                        <p className="flex items-center mt-2 font-bold text-gray-800 text-xl">
                            <i class="fa-solid fa-users"></i>
                            {event.max_participants} PARTICIPANTS MAX
                        </p>
                    )}

                    <div className="pt-6">
                        <button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 px-8 py-4 rounded-xl font-bold text-white text-2xl transition">
                            <i class="fa-solid fa-ticket"></i>
                            GET TICKETS
                        </button>
                    </div>
                </div>

                <div className="w-1/2">
                    <img
                        src={imageUrl || 'https://via.placeholder.com/600x400'}
                        alt={event.title || 'Event'}
                        className="rounded-r-2xl w-full h-full object-cover"
                        draggable="false"
                    />
                </div>
            </div>
        </div>
    );
}


export default EventsList;