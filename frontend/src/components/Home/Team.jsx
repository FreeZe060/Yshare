import React from 'react';

import BgImage from "../../assets/img/pexels-soiree.jpeg";

import ibraImage from '../../assets/img/member-ibra.jpg';
import timImage from '../../assets/img/member-tim.jpg';

import vector1 from "../../assets/img/et-3-event-vector.svg";
import vector2 from "../../assets/img/et-3-event-vector-2.svg";

const Team = () => {

    return (

        <section id='team' class="z-[1] relative py-[130px] md:py-[60px] lg:py-[80px] overflow-hidden et-speakers bg-cover bg-center bg-no-repeat">
            <div class="mx-auto px-[12px] max-w-[1200px] xl:max-w-full container">
                <div class="gap-[15px] mb-[46px] lg:mb-[16px] xl:mb-[26px] text-center et-speakers-heading">
                    <h6 class="et-section-sub-title anim-text">Projet</h6>
                    <h2 class="text-white et-section-title anim-text ">Notre Équipe</h2>
                </div>

                <div class="justify-center gap-[30px] lg:gap-[20px] grid grid-cols-3 xxs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    <div class="group et-member">
                        <div class="rounded-[16px] overflow-hidden et-member__img">
                            <img src={timImage} alt="Ibrahim Sako" className="w-full group-hover:scale-110 duration-[400ms]" />
                        </div>

                        <div class="before:-top-[33px] before:left-0 z-[1] before:-z-[1] before:absolute relative bg-white before:bg-white shadow-[0_4px_60px_rgba(249,41,187,0.16)] mx-[25px] xs:mx-[5px] md:mx-[15px] -mt-[44px] xs:mt-0 md:-mt-[15px] px-[25px] md:px-[15px] pb-[30px] md:pb-[20px] rounded-[16px] before:rounded-[16px] before:w-full before:h-full before:skew-y-[4deg] et-member__txt">
                            <div class="-top-[43px] right-[20px] absolute et-member-socials">
                                <div class="bottom-[calc(100%+8px)] -z-[2] absolute flex flex-col gap-[8px] opacity-0 group-hover:opacity-100 text-[14px] transition translate-y-[100%] group-hover:translate-y-0 duration-[400ms] et-speaker__socials">
                                    <a href="#" class="flex justify-center items-center hover:bg-[#C320C0] border border-white hover:border-[#C320C0] rounded-full w-[36px] h-[36px] text-white"><i class="fa-brands fa-facebook-f"></i></a>
                                    <a href="#" class="flex justify-center items-center hover:bg-[#C320C0] border border-white hover:border-[#C320C0] rounded-full w-[36px] h-[36px] text-white"><i class="fa-brands fa-x-twitter"></i></a>
                                    <a href="#" class="flex justify-center items-center hover:bg-[#C320C0] border border-white hover:border-[#C320C0] rounded-full w-[36px] h-[36px] text-white"><i class="fa-brands fa-linkedin-in"></i></a>
                                    <a href="#" class="flex justify-center items-center hover:bg-[#C320C0] border border-white hover:border-[#C320C0] rounded-full w-[36px] h-[36px] text-white"><i class="fa-brands fa-instagram"></i></a>
                                </div>
                                <div class="flex justify-center items-center bg-[#C320C0] rounded-full w-[36px] aspect-square et-member-socials__icon">
                                    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.89361 9.41703C9.22284 9.41703 8.61849 9.70668 8.19906 10.1675L4.42637 7.83088C4.52995 7.56611 4.58305 7.28429 4.58294 6.99999C4.58307 6.71568 4.52997 6.43386 4.42637 6.16909L8.19906 3.83238C8.61851 4.29318 9.22284 4.58297 9.89361 4.58297C11.1572 4.58297 12.1851 3.55501 12.1851 2.29143C12.1851 1.02785 11.1572 0 9.89361 0C8.63005 0 7.60209 1.02796 7.60209 2.29154C7.60204 2.57583 7.65514 2.85763 7.75866 3.1224L3.98608 5.45903C3.56663 4.99824 2.96231 4.70845 2.29154 4.70845C1.02796 4.70845 0 5.73652 0 6.99999C0 8.26354 1.02796 9.29152 2.29154 9.29152C2.96228 9.29152 3.56666 9.00185 3.98608 8.54094L7.75869 10.8776C7.65515 11.1424 7.60204 11.4242 7.60209 11.7085C7.60209 12.972 8.63003 14 9.89361 14C11.1572 14 12.1851 12.972 12.1851 11.7086C12.1851 10.445 11.1572 9.41703 9.89361 9.41703ZM8.43766 2.29154C8.43766 1.48873 9.09082 0.835596 9.89361 0.835596C10.6964 0.835596 11.3495 1.48873 11.3495 2.29154C11.3495 3.09435 10.6964 3.74748 9.89361 3.74748C9.09079 3.74748 8.43766 3.09432 8.43766 2.29154ZM2.29154 8.45593C1.48862 8.45593 0.835487 7.80277 0.835487 6.99999C0.835487 6.1972 1.48862 5.54404 2.29154 5.54404C3.09435 5.54404 3.74737 6.1972 3.74737 6.99999C3.74737 7.80277 3.09432 8.45593 2.29154 8.45593ZM8.43766 11.7085C8.43766 10.9057 9.09082 10.2525 9.89361 10.2525C10.6964 10.2525 11.3495 10.9057 11.3495 11.7084C11.3495 12.5112 10.6964 13.1644 9.89361 13.1644C9.09079 13.1644 8.43766 12.5112 8.43766 11.7084V11.7085Z" fill="white" />
                                    </svg>
                                </div>
                            </div>
                            <h5 class="mb-[4px] font-semibold text-[22px] text-etBlack md:text-[20px]"><a href="team-member-details.html" class="hover:text-[#C320C0]">Tim Vannson</a></h5>
                            <span class="text-[16px] text-etGray">0</span>
                        </div>
                    </div>

                    <div class="group et-member">
                        <div class="rounded-[16px] overflow-hidden et-member__img">
                            <img src={ibraImage} alt="Ibrahim Sako" className="w-full group-hover:scale-110 duration-[400ms]" />
                        </div>

                        <div class="before:-top-[33px] before:left-0 z-[1] before:-z-[1] before:absolute relative bg-white before:bg-white shadow-[0_4px_60px_rgba(249,41,187,0.16)] mx-[25px] xs:mx-[5px] md:mx-[15px] -mt-[44px] xs:mt-0 md:-mt-[15px] px-[25px] md:px-[15px] pb-[30px] md:pb-[20px] rounded-[16px] before:rounded-[16px] before:w-full before:h-full before:skew-y-[4deg] et-member__txt">
                            <div class="-top-[43px] right-[20px] absolute et-member-socials">
                                <div class="bottom-[calc(100%+8px)] -z-[2] absolute flex flex-col gap-[8px] opacity-0 group-hover:opacity-100 text-[14px] transition translate-y-[100%] group-hover:translate-y-0 duration-[400ms] et-speaker__socials">
                                    <a href="#" class="flex justify-center items-center hover:bg-[#C320C0] border border-white hover:border-[#C320C0] rounded-full w-[36px] h-[36px] text-white"><i class="fa-brands fa-facebook-f"></i></a>
                                    <a href="#" class="flex justify-center items-center hover:bg-[#C320C0] border border-white hover:border-[#C320C0] rounded-full w-[36px] h-[36px] text-white"><i class="fa-brands fa-x-twitter"></i></a>
                                    <a href="#" class="flex justify-center items-center hover:bg-[#C320C0] border border-white hover:border-[#C320C0] rounded-full w-[36px] h-[36px] text-white"><i class="fa-brands fa-linkedin-in"></i></a>
                                    <a href="#" class="flex justify-center items-center hover:bg-[#C320C0] border border-white hover:border-[#C320C0] rounded-full w-[36px] h-[36px] text-white"><i class="fa-brands fa-instagram"></i></a>
                                </div>
                                <div class="flex justify-center items-center bg-[#C320C0] rounded-full w-[36px] aspect-square et-member-socials__icon">
                                    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.89361 9.41703C9.22284 9.41703 8.61849 9.70668 8.19906 10.1675L4.42637 7.83088C4.52995 7.56611 4.58305 7.28429 4.58294 6.99999C4.58307 6.71568 4.52997 6.43386 4.42637 6.16909L8.19906 3.83238C8.61851 4.29318 9.22284 4.58297 9.89361 4.58297C11.1572 4.58297 12.1851 3.55501 12.1851 2.29143C12.1851 1.02785 11.1572 0 9.89361 0C8.63005 0 7.60209 1.02796 7.60209 2.29154C7.60204 2.57583 7.65514 2.85763 7.75866 3.1224L3.98608 5.45903C3.56663 4.99824 2.96231 4.70845 2.29154 4.70845C1.02796 4.70845 0 5.73652 0 6.99999C0 8.26354 1.02796 9.29152 2.29154 9.29152C2.96228 9.29152 3.56666 9.00185 3.98608 8.54094L7.75869 10.8776C7.65515 11.1424 7.60204 11.4242 7.60209 11.7085C7.60209 12.972 8.63003 14 9.89361 14C11.1572 14 12.1851 12.972 12.1851 11.7086C12.1851 10.445 11.1572 9.41703 9.89361 9.41703ZM8.43766 2.29154C8.43766 1.48873 9.09082 0.835596 9.89361 0.835596C10.6964 0.835596 11.3495 1.48873 11.3495 2.29154C11.3495 3.09435 10.6964 3.74748 9.89361 3.74748C9.09079 3.74748 8.43766 3.09432 8.43766 2.29154ZM2.29154 8.45593C1.48862 8.45593 0.835487 7.80277 0.835487 6.99999C0.835487 6.1972 1.48862 5.54404 2.29154 5.54404C3.09435 5.54404 3.74737 6.1972 3.74737 6.99999C3.74737 7.80277 3.09432 8.45593 2.29154 8.45593ZM8.43766 11.7085C8.43766 10.9057 9.09082 10.2525 9.89361 10.2525C10.6964 10.2525 11.3495 10.9057 11.3495 11.7084C11.3495 12.5112 10.6964 13.1644 9.89361 13.1644C9.09079 13.1644 8.43766 12.5112 8.43766 11.7084V11.7085Z" fill="white" />
                                    </svg>
                                </div>
                            </div>
                            <h5 class="mb-[4px] font-semibold text-[22px] text-etBlack md:text-[20px]"><a href="team-member-details.html" class="hover:text-[#C320C0]">Alexandre Perez</a></h5>
                            <span class="text-[16px] text-etGray">0</span>
                        </div>
                    </div>

                    <div class="group et-member">
                        <div class="rounded-[16px] overflow-hidden et-member__img">
                            <img src={ibraImage} alt="Ibrahim Sako" className="w-full group-hover:scale-110 duration-[400ms]" />
                        </div>

                        <div class="before:-top-[33px] before:left-0 z-[1] before:-z-[1] before:absolute relative bg-white before:bg-white shadow-[0_4px_60px_rgba(249,41,187,0.16)] mx-[25px] xs:mx-[5px] md:mx-[15px] -mt-[44px] xs:mt-0 md:-mt-[15px] px-[25px] md:px-[15px] pb-[30px] md:pb-[20px] rounded-[16px] before:rounded-[16px] before:w-full before:h-full before:skew-y-[4deg] et-member__txt">
                            <div class="-top-[43px] right-[20px] absolute et-member-socials">
                                <div class="bottom-[calc(100%+8px)] -z-[2] absolute flex flex-col gap-[8px] opacity-0 group-hover:opacity-100 text-[14px] transition translate-y-[100%] group-hover:translate-y-0 duration-[400ms] et-speaker__socials">
                                    <a href="#" class="flex justify-center items-center hover:bg-[#C320C0] border border-white hover:border-[#C320C0] rounded-full w-[36px] h-[36px] text-white"><i class="fa-brands fa-facebook-f"></i></a>
                                    <a href="#" class="flex justify-center items-center hover:bg-[#C320C0] border border-white hover:border-[#C320C0] rounded-full w-[36px] h-[36px] text-white"><i class="fa-brands fa-x-twitter"></i></a>
                                    <a href="#" class="flex justify-center items-center hover:bg-[#C320C0] border border-white hover:border-[#C320C0] rounded-full w-[36px] h-[36px] text-white"><i class="fa-brands fa-linkedin-in"></i></a>
                                    <a href="#" class="flex justify-center items-center hover:bg-[#C320C0] border border-white hover:border-[#C320C0] rounded-full w-[36px] h-[36px] text-white"><i class="fa-brands fa-instagram"></i></a>
                                </div>
                                <div class="flex justify-center items-center bg-[#C320C0] rounded-full w-[36px] aspect-square et-member-socials__icon">
                                    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.89361 9.41703C9.22284 9.41703 8.61849 9.70668 8.19906 10.1675L4.42637 7.83088C4.52995 7.56611 4.58305 7.28429 4.58294 6.99999C4.58307 6.71568 4.52997 6.43386 4.42637 6.16909L8.19906 3.83238C8.61851 4.29318 9.22284 4.58297 9.89361 4.58297C11.1572 4.58297 12.1851 3.55501 12.1851 2.29143C12.1851 1.02785 11.1572 0 9.89361 0C8.63005 0 7.60209 1.02796 7.60209 2.29154C7.60204 2.57583 7.65514 2.85763 7.75866 3.1224L3.98608 5.45903C3.56663 4.99824 2.96231 4.70845 2.29154 4.70845C1.02796 4.70845 0 5.73652 0 6.99999C0 8.26354 1.02796 9.29152 2.29154 9.29152C2.96228 9.29152 3.56666 9.00185 3.98608 8.54094L7.75869 10.8776C7.65515 11.1424 7.60204 11.4242 7.60209 11.7085C7.60209 12.972 8.63003 14 9.89361 14C11.1572 14 12.1851 12.972 12.1851 11.7086C12.1851 10.445 11.1572 9.41703 9.89361 9.41703ZM8.43766 2.29154C8.43766 1.48873 9.09082 0.835596 9.89361 0.835596C10.6964 0.835596 11.3495 1.48873 11.3495 2.29154C11.3495 3.09435 10.6964 3.74748 9.89361 3.74748C9.09079 3.74748 8.43766 3.09432 8.43766 2.29154ZM2.29154 8.45593C1.48862 8.45593 0.835487 7.80277 0.835487 6.99999C0.835487 6.1972 1.48862 5.54404 2.29154 5.54404C3.09435 5.54404 3.74737 6.1972 3.74737 6.99999C3.74737 7.80277 3.09432 8.45593 2.29154 8.45593ZM8.43766 11.7085C8.43766 10.9057 9.09082 10.2525 9.89361 10.2525C10.6964 10.2525 11.3495 10.9057 11.3495 11.7084C11.3495 12.5112 10.6964 13.1644 9.89361 13.1644C9.09079 13.1644 8.43766 12.5112 8.43766 11.7084V11.7085Z" fill="white" />
                                    </svg>
                                </div>
                            </div>
                            <h5 class="mb-[4px] font-semibold text-[22px] text-etBlack md:text-[20px]"><a href="team-member-details.html" class="hover:text-[#C320C0]">Jeremy Prat</a></h5>
                            <span class="text-[16px] text-etGray">0</span>
                        </div>
                    </div>

                    <div class="group et-member">
                        <div class="rounded-[16px] overflow-hidden et-member__img">
                            <img src={ibraImage} alt="Ibrahim Sako" className="w-full group-hover:scale-110 duration-[400ms]" />
                        </div>

                        <div class="before:-top-[33px] before:left-0 z-[1] before:-z-[1] before:absolute relative bg-white before:bg-white shadow-[0_4px_60px_rgba(249,41,187,0.16)] mx-[25px] xs:mx-[5px] md:mx-[15px] -mt-[44px] xs:mt-0 md:-mt-[15px] px-[25px] md:px-[15px] pb-[30px] md:pb-[20px] rounded-[16px] before:rounded-[16px] before:w-full before:h-full before:skew-y-[4deg] et-member__txt">
                            <div class="-top-[43px] right-[20px] absolute et-member-socials">
                                <div class="bottom-[calc(100%+8px)] -z-[2] absolute flex flex-col gap-[8px] opacity-0 group-hover:opacity-100 text-[14px] transition translate-y-[100%] group-hover:translate-y-0 duration-[400ms] et-speaker__socials">
                                    <a href="#" class="flex justify-center items-center hover:bg-[#C320C0] border border-white hover:border-[#C320C0] rounded-full w-[36px] h-[36px] text-white"><i class="fa-brands fa-facebook-f"></i></a>
                                    <a href="#" class="flex justify-center items-center hover:bg-[#C320C0] border border-white hover:border-[#C320C0] rounded-full w-[36px] h-[36px] text-white"><i class="fa-brands fa-x-twitter"></i></a>
                                    <a href="#" class="flex justify-center items-center hover:bg-[#C320C0] border border-white hover:border-[#C320C0] rounded-full w-[36px] h-[36px] text-white"><i class="fa-brands fa-linkedin-in"></i></a>
                                    <a href="#" class="flex justify-center items-center hover:bg-[#C320C0] border border-white hover:border-[#C320C0] rounded-full w-[36px] h-[36px] text-white"><i class="fa-brands fa-instagram"></i></a>
                                </div>
                                <div class="flex justify-center items-center bg-[#C320C0] rounded-full w-[36px] aspect-square et-member-socials__icon">
                                    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.89361 9.41703C9.22284 9.41703 8.61849 9.70668 8.19906 10.1675L4.42637 7.83088C4.52995 7.56611 4.58305 7.28429 4.58294 6.99999C4.58307 6.71568 4.52997 6.43386 4.42637 6.16909L8.19906 3.83238C8.61851 4.29318 9.22284 4.58297 9.89361 4.58297C11.1572 4.58297 12.1851 3.55501 12.1851 2.29143C12.1851 1.02785 11.1572 0 9.89361 0C8.63005 0 7.60209 1.02796 7.60209 2.29154C7.60204 2.57583 7.65514 2.85763 7.75866 3.1224L3.98608 5.45903C3.56663 4.99824 2.96231 4.70845 2.29154 4.70845C1.02796 4.70845 0 5.73652 0 6.99999C0 8.26354 1.02796 9.29152 2.29154 9.29152C2.96228 9.29152 3.56666 9.00185 3.98608 8.54094L7.75869 10.8776C7.65515 11.1424 7.60204 11.4242 7.60209 11.7085C7.60209 12.972 8.63003 14 9.89361 14C11.1572 14 12.1851 12.972 12.1851 11.7086C12.1851 10.445 11.1572 9.41703 9.89361 9.41703ZM8.43766 2.29154C8.43766 1.48873 9.09082 0.835596 9.89361 0.835596C10.6964 0.835596 11.3495 1.48873 11.3495 2.29154C11.3495 3.09435 10.6964 3.74748 9.89361 3.74748C9.09079 3.74748 8.43766 3.09432 8.43766 2.29154ZM2.29154 8.45593C1.48862 8.45593 0.835487 7.80277 0.835487 6.99999C0.835487 6.1972 1.48862 5.54404 2.29154 5.54404C3.09435 5.54404 3.74737 6.1972 3.74737 6.99999C3.74737 7.80277 3.09432 8.45593 2.29154 8.45593ZM8.43766 11.7085C8.43766 10.9057 9.09082 10.2525 9.89361 10.2525C10.6964 10.2525 11.3495 10.9057 11.3495 11.7084C11.3495 12.5112 10.6964 13.1644 9.89361 13.1644C9.09079 13.1644 8.43766 12.5112 8.43766 11.7084V11.7085Z" fill="white" />
                                    </svg>
                                </div>
                            </div>
                            <h5 class="mb-[4px] font-semibold text-[22px] text-etBlack md:text-[20px]"><a href="team-member-details.html" class="hover:text-[#C320C0]">Ibrahim Sako</a></h5>
                            <span class="text-[16px] text-etGray">0</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="*:-z-[1] *:absolute">
                <div className="-top-[195px] -left-[519px] bg-gradient-to-b from-etPurple to-etPink blur-[230px] rounded-full w-[688px] aspect-square"></div>
                <div className="-right-[319px] bottom-[300px] bg-gradient-to-b from-etPink to-etPink blur-[230px] rounded-full w-[588px] aspect-square"></div>
                <img src={vector1} alt="vector" className="top-0 left-0 opacity-25" />
                <img src={vector1} alt="vector" className="right-0 bottom-0 opacity-25 rotate-180" />
                <img src={vector2} alt="vector" className="top-[33px] -right-[175px] animate-[etSpin_7s_linear_infinite]" />
                <img src={vector2} alt="vector" className="top-[1033px] -left-[175px] animate-[etSpin_7s_linear_infinite]" />
            </div>
        </section>
    );
};

export default Team;