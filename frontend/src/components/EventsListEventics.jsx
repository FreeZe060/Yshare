import React, { useState } from 'react';

import '../assets/css/style.css';
import useSlideUpAnimation from '../hooks/Animations/useSlideUpAnimation';

import { formatEuro } from '../utils/format';

function EventsListEventics({ events }) {

    useSlideUpAnimation();

    return (
        <section class="z-[1] relative py-[120px] md:py-[60px] xl:py-[80px] overflow-hidden">
            <div class="mx-auto px-[12px] max-w-[1200px] xl:max-w-full">
                <div class="mb-[60px] md:mb-[40px] pb-[60px] md:pb-[40px] border-[#8E8E93]/25 border-b">
                    <h6 class="after:top-[46%] after:right-0 after:absolute anim-text mx-auto pr-[45px] w-max after:w-[30px] max-w-full after:h-[5px] et-3-section-sub-title">Upcoming Event</h6>
                    <h2 class="anim-text mb-[26px] text-center et-3-section-title">Upcoming Events</h2>

                    <div class="*:before:-z-[1] *:z-[1] *:before:absolute *:relative *:before:inset-0 flex flex-wrap justify-center gap-[30px] xxs:gap-[15px] *:before:bg-gradient-to-r *:before:from-[#550ECA] *:before:to-[#F929BB] *:before:opacity-0 *:px-[25px] *:border *:border-[#8E8E93] *:h-[30px] *:text-[17px] et-3-event-tab-navs rev-slide-up">
                        <button class="tab-nav active" data-tab="et-3-event-1st-tab">Dance</button>
                        <button class="tab-nav" data-tab="et-3-event-2nd-tab">Drink</button>
                        <button class="tab-nav" data-tab="et-3-event-3rd-tab">Meet up</button>
                    </div>
                </div>

                <div>
                    <div class="space-y-[30px] et-tab active" id="et-3-event-1st-tab">
                        <div class="flex md:flex-wrap justify-center items-center gap-[71px] md:gap-[31px] lg:gap-[41px] pb-[30px] border-[#8E8E93]/25 border-b rev-slide-up">
                            <h5 class="text-[24px] text-etBlue text-center shrink-0"><span class="block font-semibold text-[48px] text-etBlack leading-[0.7]">10</span>July 2024</h5>
                            <div class="xs:w-full shrink-0">
                                <img src="assets/img/et-3-news-3.jpg" alt="Event Image" class="xs:w-full max-w-[300px] xs:max-w-full object-cover aspect-[300/128]"></img>
                            </div>
                            <div class="flex xxs:flex-col justify-between md:justify-center xxs:gap-y-[15px] grow">
                                <div class="flex items-center gap-[78px] lg:gap-[38px]">
                                    <div>
                                        <h3 class="mb-[11px] font-semibold text-[30px] text-etBlack hover:text-etBlue tracking-[-1px]"><a href="event-details.html">Dance Show</a></h3>
                                        <h6 class="text-[17px] text-etBlue">July 10, 2024 - October 9, 2025</h6>
                                    </div>

                                    <h4 class="font-semibold text-[30px] text-etBlue">$125</h4>
                                </div>

                                <div class="ml-[40px] xxs:ml-0 lg:ml-[25px] pl-[40px] xxs:pl-0 lg:pl-[25px] border-l xxs:border-none text-center shrink-0">
                                    <div class="flex justify-center mb-[20px] *:-ml-[20px]">
                                        <img src="assets/img/reviewer-1.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-2.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                    </div>

                                    <a href="#" class="et-3-btn">
                                        <span class="icon">
                                            <svg width="27" height="16" viewBox="0 0 27 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.02101 0H0.844661C0.378197 0 0 0.378144 0 0.844662V5.12625C0 5.59277 0.378197 5.97091 0.844661 5.97091C1.96347 5.97091 2.8737 6.88114 2.8737 8C2.8737 9.11886 1.96347 10.029 0.844661 10.029C0.378197 10.029 0 10.4071 0 10.8736V15.1553C0 15.6218 0.378197 15.9999 0.844661 15.9999H8.02101V0Z" class="fill-white transition"></path>
                                                <path d="M26.0001 5.97091C26.4665 5.97091 26.8447 5.59277 26.8447 5.12625V0.844662C26.8447 0.378144 26.4665 0 26.0001 0H9.71094V16H26.0001C26.4665 16 26.8447 15.6219 26.8447 15.1553V10.8737C26.8447 10.4072 26.4665 10.029 26.0001 10.029C24.8813 10.029 23.971 9.11886 23.971 8C23.971 6.88114 24.8813 5.97091 26.0001 5.97091Z" class="fill-white transition"></path>
                                            </svg>
                                        </span>
                                        Get Tickets</a>
                                </div>
                            </div>
                        </div>

                        <div class="flex md:flex-wrap justify-center items-center gap-[71px] md:gap-[31px] lg:gap-[41px] pb-[30px] border-[#8E8E93]/25 border-b rev-slide-up">
                            <h5 class="text-[24px] text-etBlue text-center shrink-0"><span class="block font-semibold text-[48px] text-etBlack leading-[0.7]">10</span>July 2024</h5>
                            <div class="xs:w-full shrink-0">
                                <img src="assets/img/et-3-news-2.jpg" alt="Event Image" class="xs:w-full max-w-[300px] xs:max-w-full object-cover aspect-[300/128]"></img>
                            </div>
                            <div class="flex xxs:flex-col justify-between md:justify-center xxs:gap-y-[15px] grow">
                                <div class="flex items-center gap-[78px] lg:gap-[38px]">
                                    <div>
                                        <h3 class="mb-[11px] font-semibold text-[30px] text-etBlack hover:text-etBlue tracking-[-1px]"><a href="event-details.html">Parties dance Club</a></h3>
                                        <h6 class="text-[17px] text-etBlue">July 10, 2024 - October 9, 2025</h6>
                                    </div>

                                    <h4 class="font-semibold text-[30px] text-etBlue">$125</h4>
                                </div>

                                <div class="ml-[40px] xxs:ml-0 lg:ml-[25px] pl-[40px] xxs:pl-0 lg:pl-[25px] border-l xxs:border-none text-center shrink-0">
                                    <div class="flex justify-center mb-[20px] *:-ml-[20px]">
                                        <img src="assets/img/reviewer-1.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-2.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                    </div>

                                    <a href="#" class="et-3-btn">
                                        <span class="icon">
                                            <svg width="27" height="16" viewBox="0 0 27 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.02101 0H0.844661C0.378197 0 0 0.378144 0 0.844662V5.12625C0 5.59277 0.378197 5.97091 0.844661 5.97091C1.96347 5.97091 2.8737 6.88114 2.8737 8C2.8737 9.11886 1.96347 10.029 0.844661 10.029C0.378197 10.029 0 10.4071 0 10.8736V15.1553C0 15.6218 0.378197 15.9999 0.844661 15.9999H8.02101V0Z" class="fill-white transition"></path>
                                                <path d="M26.0001 5.97091C26.4665 5.97091 26.8447 5.59277 26.8447 5.12625V0.844662C26.8447 0.378144 26.4665 0 26.0001 0H9.71094V16H26.0001C26.4665 16 26.8447 15.6219 26.8447 15.1553V10.8737C26.8447 10.4072 26.4665 10.029 26.0001 10.029C24.8813 10.029 23.971 9.11886 23.971 8C23.971 6.88114 24.8813 5.97091 26.0001 5.97091Z" class="fill-white transition"></path>
                                            </svg>
                                        </span>
                                        Get Tickets</a>
                                </div>
                            </div>
                        </div>

                        <div class="flex md:flex-wrap justify-center items-center gap-[71px] md:gap-[31px] lg:gap-[41px] pb-[30px] border-[#8E8E93]/25 border-b rev-slide-up">
                            <h5 class="text-[24px] text-etBlue text-center shrink-0"><span class="block font-semibold text-[48px] text-etBlack leading-[0.7]">10</span>July 2024</h5>
                            <div class="xs:w-full shrink-0">
                                <img src="assets/img/et-3-news-4.jpg" alt="Event Image" class="xs:w-full max-w-[300px] xs:max-w-full object-cover aspect-[300/128]"></img>
                            </div>
                            <div class="flex xxs:flex-col justify-between md:justify-center xxs:gap-y-[15px] grow">
                                <div class="flex items-center gap-[78px] lg:gap-[38px]">
                                    <div>
                                        <h3 class="mb-[11px] font-semibold text-[30px] text-etBlack hover:text-etBlue tracking-[-1px]"><a href="event-details.html">Light Dance Show</a></h3>
                                        <h6 class="text-[17px] text-etBlue">July 10, 2024 - October 9, 2025</h6>
                                    </div>

                                    <h4 class="font-semibold text-[30px] text-etBlue">$125</h4>
                                </div>

                                <div class="ml-[40px] xxs:ml-0 lg:ml-[25px] pl-[40px] xxs:pl-0 lg:pl-[25px] border-l xxs:border-none text-center shrink-0">
                                    <div class="flex justify-center mb-[20px] *:-ml-[20px]">
                                        <img src="assets/img/reviewer-1.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-2.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                    </div>

                                    <a href="#" class="et-3-btn">
                                        <span class="icon">
                                            <svg width="27" height="16" viewBox="0 0 27 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.02101 0H0.844661C0.378197 0 0 0.378144 0 0.844662V5.12625C0 5.59277 0.378197 5.97091 0.844661 5.97091C1.96347 5.97091 2.8737 6.88114 2.8737 8C2.8737 9.11886 1.96347 10.029 0.844661 10.029C0.378197 10.029 0 10.4071 0 10.8736V15.1553C0 15.6218 0.378197 15.9999 0.844661 15.9999H8.02101V0Z" class="fill-white transition"></path>
                                                <path d="M26.0001 5.97091C26.4665 5.97091 26.8447 5.59277 26.8447 5.12625V0.844662C26.8447 0.378144 26.4665 0 26.0001 0H9.71094V16H26.0001C26.4665 16 26.8447 15.6219 26.8447 15.1553V10.8737C26.8447 10.4072 26.4665 10.029 26.0001 10.029C24.8813 10.029 23.971 9.11886 23.971 8C23.971 6.88114 24.8813 5.97091 26.0001 5.97091Z" class="fill-white transition"></path>
                                            </svg>
                                        </span>
                                        Get Tickets</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="et-tab" id="et-3-event-2nd-tab">
                        <div class="flex md:flex-wrap justify-center items-center gap-[71px] md:gap-[31px] lg:gap-[41px] pb-[30px] border-[#8E8E93]/25 border-b rev-slide-up">
                            <h5 class="text-[24px] text-etBlue text-center shrink-0"><span class="block font-semibold text-[48px] text-etBlack leading-[0.7]">10</span>July 2024</h5>
                            <div class="xs:w-full shrink-0">
                                <img src="assets/img/et-3-news-3.jpg" alt="Event Image" class="xs:w-full max-w-[300px] xs:max-w-full object-cover aspect-[300/128]"></img>
                            </div>
                            <div class="flex xxs:flex-col justify-between md:justify-center xxs:gap-y-[15px] grow">
                                <div class="flex items-center gap-[78px] lg:gap-[38px]">
                                    <div>
                                        <h3 class="mb-[11px] font-semibold text-[30px] text-etBlack hover:text-etBlue tracking-[-1px]"><a href="event-details.html">Dance Show</a></h3>
                                        <h6 class="text-[17px] text-etBlue">July 10, 2024 - October 9, 2025</h6>
                                    </div>

                                    <h4 class="font-semibold text-[30px] text-etBlue">$125</h4>
                                </div>

                                <div class="ml-[40px] xxs:ml-0 lg:ml-[25px] pl-[40px] xxs:pl-0 lg:pl-[25px] border-l xxs:border-none text-center shrink-0">
                                    <div class="flex justify-center mb-[20px] *:-ml-[20px]">
                                        <img src="assets/img/reviewer-1.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-2.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                    </div>

                                    <a href="#" class="et-3-btn">
                                        <span class="icon">
                                            <svg width="27" height="16" viewBox="0 0 27 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.02101 0H0.844661C0.378197 0 0 0.378144 0 0.844662V5.12625C0 5.59277 0.378197 5.97091 0.844661 5.97091C1.96347 5.97091 2.8737 6.88114 2.8737 8C2.8737 9.11886 1.96347 10.029 0.844661 10.029C0.378197 10.029 0 10.4071 0 10.8736V15.1553C0 15.6218 0.378197 15.9999 0.844661 15.9999H8.02101V0Z" class="fill-white transition"></path>
                                                <path d="M26.0001 5.97091C26.4665 5.97091 26.8447 5.59277 26.8447 5.12625V0.844662C26.8447 0.378144 26.4665 0 26.0001 0H9.71094V16H26.0001C26.4665 16 26.8447 15.6219 26.8447 15.1553V10.8737C26.8447 10.4072 26.4665 10.029 26.0001 10.029C24.8813 10.029 23.971 9.11886 23.971 8C23.971 6.88114 24.8813 5.97091 26.0001 5.97091Z" class="fill-white transition"></path>
                                            </svg>
                                        </span>
                                        Get Tickets</a>
                                </div>
                            </div>
                        </div>

                        <div class="flex md:flex-wrap justify-center items-center gap-[71px] md:gap-[31px] lg:gap-[41px] pb-[30px] border-[#8E8E93]/25 border-b rev-slide-up">
                            <h5 class="text-[24px] text-etBlue text-center shrink-0"><span class="block font-semibold text-[48px] text-etBlack leading-[0.7]">10</span>July 2024</h5>
                            <div class="xs:w-full shrink-0">
                                <img src="assets/img/et-3-news-2.jpg" alt="Event Image" class="xs:w-full max-w-[300px] xs:max-w-full object-cover aspect-[300/128]"></img>
                            </div>
                            <div class="flex xxs:flex-col justify-between md:justify-center xxs:gap-y-[15px] grow">
                                <div class="flex items-center gap-[78px] lg:gap-[38px]">
                                    <div>
                                        <h3 class="mb-[11px] font-semibold text-[30px] text-etBlack hover:text-etBlue tracking-[-1px]"><a href="event-details.html">Parties dance Club</a></h3>
                                        <h6 class="text-[17px] text-etBlue">July 10, 2024 - October 9, 2025</h6>
                                    </div>

                                    <h4 class="font-semibold text-[30px] text-etBlue">$125</h4>
                                </div>

                                <div class="ml-[40px] xxs:ml-0 lg:ml-[25px] pl-[40px] xxs:pl-0 lg:pl-[25px] border-l xxs:border-none text-center shrink-0">
                                    <div class="flex justify-center mb-[20px] *:-ml-[20px]">
                                        <img src="assets/img/reviewer-1.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-2.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                    </div>

                                    <a href="#" class="et-3-btn">
                                        <span class="icon">
                                            <svg width="27" height="16" viewBox="0 0 27 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.02101 0H0.844661C0.378197 0 0 0.378144 0 0.844662V5.12625C0 5.59277 0.378197 5.97091 0.844661 5.97091C1.96347 5.97091 2.8737 6.88114 2.8737 8C2.8737 9.11886 1.96347 10.029 0.844661 10.029C0.378197 10.029 0 10.4071 0 10.8736V15.1553C0 15.6218 0.378197 15.9999 0.844661 15.9999H8.02101V0Z" class="fill-white transition"></path>
                                                <path d="M26.0001 5.97091C26.4665 5.97091 26.8447 5.59277 26.8447 5.12625V0.844662C26.8447 0.378144 26.4665 0 26.0001 0H9.71094V16H26.0001C26.4665 16 26.8447 15.6219 26.8447 15.1553V10.8737C26.8447 10.4072 26.4665 10.029 26.0001 10.029C24.8813 10.029 23.971 9.11886 23.971 8C23.971 6.88114 24.8813 5.97091 26.0001 5.97091Z" class="fill-white transition"></path>
                                            </svg>
                                        </span>
                                        Get Tickets</a>
                                </div>
                            </div>
                        </div>

                        <div class="flex md:flex-wrap justify-center items-center gap-[71px] md:gap-[31px] lg:gap-[41px] pb-[30px] border-[#8E8E93]/25 border-b rev-slide-up">
                            <h5 class="text-[24px] text-etBlue text-center shrink-0"><span class="block font-semibold text-[48px] text-etBlack leading-[0.7]">10</span>July 2024</h5>
                            <div class="xs:w-full shrink-0">
                                <img src="assets/img/et-3-news-4.jpg" alt="Event Image" class="xs:w-full max-w-[300px] xs:max-w-full object-cover aspect-[300/128]"></img>
                            </div>
                            <div class="flex xxs:flex-col justify-between md:justify-center xxs:gap-y-[15px] grow">
                                <div class="flex items-center gap-[78px] lg:gap-[38px]">
                                    <div>
                                        <h3 class="mb-[11px] font-semibold text-[30px] text-etBlack hover:text-etBlue tracking-[-1px]"><a href="event-details.html">Light Dance Show</a></h3>
                                        <h6 class="text-[17px] text-etBlue">July 10, 2024 - October 9, 2025</h6>
                                    </div>

                                    <h4 class="font-semibold text-[30px] text-etBlue">$125</h4>
                                </div>

                                <div class="ml-[40px] xxs:ml-0 lg:ml-[25px] pl-[40px] xxs:pl-0 lg:pl-[25px] border-l xxs:border-none text-center shrink-0">
                                    <div class="flex justify-center mb-[20px] *:-ml-[20px]">
                                        <img src="assets/img/reviewer-1.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-2.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                    </div>

                                    <a href="#" class="et-3-btn">
                                        <span class="icon">
                                            <svg width="27" height="16" viewBox="0 0 27 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.02101 0H0.844661C0.378197 0 0 0.378144 0 0.844662V5.12625C0 5.59277 0.378197 5.97091 0.844661 5.97091C1.96347 5.97091 2.8737 6.88114 2.8737 8C2.8737 9.11886 1.96347 10.029 0.844661 10.029C0.378197 10.029 0 10.4071 0 10.8736V15.1553C0 15.6218 0.378197 15.9999 0.844661 15.9999H8.02101V0Z" class="fill-white transition"></path>
                                                <path d="M26.0001 5.97091C26.4665 5.97091 26.8447 5.59277 26.8447 5.12625V0.844662C26.8447 0.378144 26.4665 0 26.0001 0H9.71094V16H26.0001C26.4665 16 26.8447 15.6219 26.8447 15.1553V10.8737C26.8447 10.4072 26.4665 10.029 26.0001 10.029C24.8813 10.029 23.971 9.11886 23.971 8C23.971 6.88114 24.8813 5.97091 26.0001 5.97091Z" class="fill-white transition"></path>
                                            </svg>
                                        </span>
                                        Get Tickets</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="et-tab" id="et-3-event-3rd-tab">
                        <div class="flex md:flex-wrap justify-center items-center gap-[71px] md:gap-[31px] lg:gap-[41px] pb-[30px] border-[#8E8E93]/25 border-b rev-slide-up">
                            <h5 class="text-[24px] text-etBlue text-center shrink-0"><span class="block font-semibold text-[48px] text-etBlack leading-[0.7]">10</span>July 2024</h5>
                            <div class="xs:w-full shrink-0">
                                <img src="assets/img/et-3-news-3.jpg" alt="Event Image" class="xs:w-full max-w-[300px] xs:max-w-full object-cover aspect-[300/128]"></img>
                            </div>
                            <div class="flex xxs:flex-col justify-between md:justify-center xxs:gap-y-[15px] grow">
                                <div class="flex items-center gap-[78px] lg:gap-[38px]">
                                    <div>
                                        <h3 class="mb-[11px] font-semibold text-[30px] text-etBlack hover:text-etBlue tracking-[-1px]"><a href="event-details.html">Dance Show</a></h3>
                                        <h6 class="text-[17px] text-etBlue">July 10, 2024 - October 9, 2025</h6>
                                    </div>

                                    <h4 class="font-semibold text-[30px] text-etBlue">$125</h4>
                                </div>

                                <div class="ml-[40px] xxs:ml-0 lg:ml-[25px] pl-[40px] xxs:pl-0 lg:pl-[25px] border-l xxs:border-none text-center shrink-0">
                                    <div class="flex justify-center mb-[20px] *:-ml-[20px]">
                                        <img src="assets/img/reviewer-1.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-2.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                    </div>

                                    <a href="#" class="et-3-btn">
                                        <span class="icon">
                                            <svg width="27" height="16" viewBox="0 0 27 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.02101 0H0.844661C0.378197 0 0 0.378144 0 0.844662V5.12625C0 5.59277 0.378197 5.97091 0.844661 5.97091C1.96347 5.97091 2.8737 6.88114 2.8737 8C2.8737 9.11886 1.96347 10.029 0.844661 10.029C0.378197 10.029 0 10.4071 0 10.8736V15.1553C0 15.6218 0.378197 15.9999 0.844661 15.9999H8.02101V0Z" class="fill-white transition"></path>
                                                <path d="M26.0001 5.97091C26.4665 5.97091 26.8447 5.59277 26.8447 5.12625V0.844662C26.8447 0.378144 26.4665 0 26.0001 0H9.71094V16H26.0001C26.4665 16 26.8447 15.6219 26.8447 15.1553V10.8737C26.8447 10.4072 26.4665 10.029 26.0001 10.029C24.8813 10.029 23.971 9.11886 23.971 8C23.971 6.88114 24.8813 5.97091 26.0001 5.97091Z" class="fill-white transition"></path>
                                            </svg>
                                        </span>
                                        Get Tickets</a>
                                </div>
                            </div>
                        </div>

                        <div class="flex md:flex-wrap justify-center items-center gap-[71px] md:gap-[31px] lg:gap-[41px] pb-[30px] border-[#8E8E93]/25 border-b rev-slide-up">
                            <h5 class="text-[24px] text-etBlue text-center shrink-0"><span class="block font-semibold text-[48px] text-etBlack leading-[0.7]">10</span>July 2024</h5>
                            <div class="xs:w-full shrink-0">
                                <img src="assets/img/et-3-news-2.jpg" alt="Event Image" class="xs:w-full max-w-[300px] xs:max-w-full object-cover aspect-[300/128]"></img>
                            </div>
                            <div class="flex xxs:flex-col justify-between md:justify-center xxs:gap-y-[15px] grow">
                                <div class="flex items-center gap-[78px] lg:gap-[38px]">
                                    <div>
                                        <h3 class="mb-[11px] font-semibold text-[30px] text-etBlack hover:text-etBlue tracking-[-1px]"><a href="event-details.html">Parties dance Club</a></h3>
                                        <h6 class="text-[17px] text-etBlue">July 10, 2024 - October 9, 2025</h6>
                                    </div>

                                    <h4 class="font-semibold text-[30px] text-etBlue">$125</h4>
                                </div>

                                <div class="ml-[40px] xxs:ml-0 lg:ml-[25px] pl-[40px] xxs:pl-0 lg:pl-[25px] border-l xxs:border-none text-center shrink-0">
                                    <div class="flex justify-center mb-[20px] *:-ml-[20px]">
                                        <img src="assets/img/reviewer-1.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-2.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                    </div>

                                    <a href="#" class="et-3-btn">
                                        <span class="icon">
                                            <svg width="27" height="16" viewBox="0 0 27 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.02101 0H0.844661C0.378197 0 0 0.378144 0 0.844662V5.12625C0 5.59277 0.378197 5.97091 0.844661 5.97091C1.96347 5.97091 2.8737 6.88114 2.8737 8C2.8737 9.11886 1.96347 10.029 0.844661 10.029C0.378197 10.029 0 10.4071 0 10.8736V15.1553C0 15.6218 0.378197 15.9999 0.844661 15.9999H8.02101V0Z" class="fill-white transition"></path>
                                                <path d="M26.0001 5.97091C26.4665 5.97091 26.8447 5.59277 26.8447 5.12625V0.844662C26.8447 0.378144 26.4665 0 26.0001 0H9.71094V16H26.0001C26.4665 16 26.8447 15.6219 26.8447 15.1553V10.8737C26.8447 10.4072 26.4665 10.029 26.0001 10.029C24.8813 10.029 23.971 9.11886 23.971 8C23.971 6.88114 24.8813 5.97091 26.0001 5.97091Z" class="fill-white transition"></path>
                                            </svg>
                                        </span>
                                        Get Tickets</a>
                                </div>
                            </div>
                        </div>
                        <div class="flex md:flex-wrap justify-center items-center gap-[71px] md:gap-[31px] lg:gap-[41px] pb-[30px] border-[#8E8E93]/25 border-b rev-slide-up">
                            <h5 class="text-[24px] text-etBlue text-center shrink-0"><span class="block font-semibold text-[48px] text-etBlack leading-[0.7]">10</span>July 2024</h5>
                            <div class="xs:w-full shrink-0">
                                <img src="assets/img/et-3-news-4.jpg" alt="Event Image" class="xs:w-full max-w-[300px] xs:max-w-full object-cover aspect-[300/128]"></img>
                            </div>
                            <div class="flex xxs:flex-col justify-between md:justify-center xxs:gap-y-[15px] grow">
                                <div class="flex items-center gap-[78px] lg:gap-[38px]">
                                    <div>
                                        <h3 class="mb-[11px] font-semibold text-[30px] text-etBlack hover:text-etBlue tracking-[-1px]"><a href="event-details.html">Light Dance Show</a></h3>
                                        <h6 class="text-[17px] text-etBlue">July 10, 2024 - October 9, 2025</h6>
                                    </div>

                                    <h4 class="font-semibold text-[30px] text-etBlue">$125</h4>
                                </div>

                                <div class="ml-[40px] xxs:ml-0 lg:ml-[25px] pl-[40px] xxs:pl-0 lg:pl-[25px] border-l xxs:border-none text-center shrink-0">
                                    <div class="flex justify-center mb-[20px] *:-ml-[20px]">
                                        <img src="assets/img/reviewer-1.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-2.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                        <img src="assets/img/reviewer-3.png" alt="Person" class="first:ml-0 border-[3px] border-white rounded-full w-[40px] aspect-square"></img>
                                    </div>

                                    <a href="#" class="et-3-btn">
                                        <span class="icon">
                                            <svg width="27" height="16" viewBox="0 0 27 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.02101 0H0.844661C0.378197 0 0 0.378144 0 0.844662V5.12625C0 5.59277 0.378197 5.97091 0.844661 5.97091C1.96347 5.97091 2.8737 6.88114 2.8737 8C2.8737 9.11886 1.96347 10.029 0.844661 10.029C0.378197 10.029 0 10.4071 0 10.8736V15.1553C0 15.6218 0.378197 15.9999 0.844661 15.9999H8.02101V0Z" class="fill-white transition"></path>
                                                <path d="M26.0001 5.97091C26.4665 5.97091 26.8447 5.59277 26.8447 5.12625V0.844662C26.8447 0.378144 26.4665 0 26.0001 0H9.71094V16H26.0001C26.4665 16 26.8447 15.6219 26.8447 15.1553V10.8737C26.8447 10.4072 26.4665 10.029 26.0001 10.029C24.8813 10.029 23.971 9.11886 23.971 8C23.971 6.88114 24.8813 5.97091 26.0001 5.97091Z" class="fill-white transition"></path>
                                            </svg>
                                        </span>
                                        Get Tickets</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="*:-z-[1] *:absolute">
                <h3 class="xl:hidden bottom-[120px] left-[68px] xxl:left-[8px] anim-text et-outlined-text h-max font-bold text-[65px] uppercase tracking-widest -scale-[1] et-vertical-txt">upcoming events</h3>
                <div class="-top-[195px] -left-[519px] bg-gradient-to-b from-etPurple to-etPink blur-[230px] rounded-full w-[588px] aspect-square"></div>
                <img src="assets/img/et-3-event-vector.svg" alt="vector" class="top-0 left-0 opacity-25"></img>
                <img src="assets/img/et-3-event-vector-2.svg" alt="vector" class="top-[33px] -right-[175px] animate-[etSpin_7s_linear_infinite]"></img>
            </div>
        </section>

    );
}

export default EventsListEventics;
