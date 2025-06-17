import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import '../../assets/css/style.css';
import useSlideUpAnimation from '../../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../../hooks/Animations/useTextAnimation';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';

import { formatEuro, formatDate, capitalizeFirstLetter } from '../../utils/format';

import eventBgImage from "../../assets/img/et-3-calender-event.jpg";

function BannerSection() {

    useSlideUpAnimation();
    useTextAnimation();

    return (
        <section class="et-3-banner relative bg-gradient-to-b from-[#550ECA] to-[#F929BB] bg-cover bg-center " style={{ backgroundImage: `url(${eventBgImage})` }}>
            <div class="bg-no-repeat w-full h-full bg-cover bg-center pt-[clamp(20px,8.3vw,160px)] pb-[clamp(20px,8.3vw,160px)] md:pb-0 text-white relative overflow-hidden z-[1] before:content-normal before:absolute before:inset-0 before:opacity-50 before:bg-gradient-to-b before:from-[#550ECA] before:to-[#F929BB] before:-z-[1]">
                <div class="mx-[24.7em] xxxl:mx-[15.7em] xxl:mx-[40px] xs:mx-[12px]">
                    <div class="flex md:flex-col items-center justify-between gap-x-[30px] gap-y-[40px] md:grid-cols-1">
                        <div class="left relative z-[20] w-[60%] shrink-0 md:w-full">
                            <h6 className="text-[clamp(30px,6vw,80px)] font-bold tracking-tight leading-tight anim-text">
                                <span className="text-[#F929BB]">Y</span> Share
                            </h6>
                            <h1 className="text-[clamp(22px,4vw,48px)] font-light leading-snug mt-2 anim-text">
                                Les meilleurs événements, rien que pour vous
                            </h1>
                        </div>
                    </div>
                </div>
                <div class="et-3-banner-vector bg-gradient-to-b from-[#550ECA] to-[#F929BB] opacity-25 absolute h-full w-[24.7%] top-0 left-1/2 z-[0] -skew-x-[31deg] pointer-events-none"></div>
            </div>
        </section>
    );
}

export default BannerSection;
