import React from 'react';

import '../assets/css/style.css';

import aboutImg1 from "../assets/img/about-3-img-1.png";
import aboutImg2 from "../assets/img/about-3-img-2.jpg";
import aboutRoundText from "../assets/img/about-3-round-text.svg";
import aboutVector1 from "../assets/img/about-3-img-vector.svg";
import aboutVector2 from "../assets/img/about-3-img-vector-2.svg";
import aboutVector3 from "../assets/img/about-3-vector-1.svg";
import aboutVector4 from "../assets/img/about-3-vector-2.svg";
import aboutVector5 from "../assets/img/about-3-vector-3.svg";

function AboutClub({ events }) {
    // const displayedEvents = events.slice(0, 10);

    return (
        <section className="z-[1] relative py-[120px] md:py-[60px] xl:py-[80px] et-3-about">
            <div className="mx-[24.7em] xs:mx-[12px] xxxl:mx-[15.7em] xxl:mx-[40px]">
                <div className="flex md:flex-col items-center gap-[60px] xl:gap-[40px]">
                    <div className="flex gap-[30px] -ml-[32px] md:ml-0 max-w-[55%] md:max-w-full shrink-0 rev-slide-up">
                        <div className="z-[1] relative">
                            <img src={aboutImg1} alt="image" />
                            <img src={aboutRoundText} alt="round text" className="top-[8%] left-[8%] -z-[1] absolute max-w-[86%] animate-[etSpin_7s_infinite_linear_forwards_reverse]" />
                        </div>
                        <div className="z-[1] relative">
                            <img src={aboutImg2} alt="image" />
                            <div className="*:-z-[5] *:absolute">
                                <img src={aboutVector1} alt="vector" className="-top-[20px] -left-[20px]" />
                                <img src={aboutVector2} alt="vector" className="bottom-[23px] -left-[42px]" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h6 className="anim-text et-3-section-sub-title">ABOUT CLUB</h6>
                        <h2 className="anim-text max-w-[70%] xs:max-w-full et-3-section-title">Experience the Best Events in Town</h2>
                        <div className="rev-slide-up">
                            <p className="mt-[17px] mb-[43px] text-[#8E8E93] text-[17px]">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>
                            <a href="#" className="et-3-btn">
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
                </div>
            </div>

            <div className="xl:hidden *:-z-[1] *:absolute *:pointer-events-none">
                <img src={aboutVector3} alt="vector" className="top-0 left-0" />
                <img src={aboutVector4} alt="vector" className="top-[118px] right-[264px]" />
                <img src={aboutVector5} alt="vector" className="right-[75px] bottom-[25px]" />
            </div>
        </section>
    );
}

export default AboutClub;
