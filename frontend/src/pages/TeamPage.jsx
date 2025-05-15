import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useLogin from '../hooks/User/useLogin';
import Swal from 'sweetalert2';
import 'animate.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from '../config/authHeader';
import useTextAnimation from '../hooks/Animations/useTextAnimation';
import useSlideUpAnimation from '../hooks/Animations/useSlideUpAnimation';

const TeamPage = () => {

    return (
        <>
            <Header />
            <main>
                <section className="et-breadcrumb bg-[#000D83] pt-[210px] lg:pt-[190px] sm:pt-[160px] pb-[130px] lg:pb-[110px] sm:pb-[80px] relative z-[1] before:absolute before:inset-0 before:bg-no-repeat before:bg-cover before:bg-center before:-z-[1] before:opacity-30">
                    <div className="container mx-auto max-w-[1200px] px-[12px] xl:max-w-full text-center text-white">
                        <h1 className="et-breadcrumb-title font-medium text-[56px] md:text-[50px] xs:text-[45px]">Notre Team</h1>
                        <ul className="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li className="opacity-80 cursor-pointer hover:text-blue-400">
                                <a href="/">Home</a>
                            </li>
                            <li><i className="fa-solid fa-angle-right"></i><i className="fa-solid fa-angle-right"></i></li>
                            <li className="current-page">Notre Team</li>
                        </ul>
                    </div>
                </section>

                <div className="py-[130px] lg:py-[80px] md:py-[60px]">
                    <section className="et-team">
                        <div className="container mx-auto max-w-[1300px] px-[12px]">
                            <div className="grid grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xxs:grid-cols-1 justify-center gap-[30px] lg:gap-[20px]">
                                <div className="et-member group">
                                    <div className="et-member__img rounded-[16px] overflow-hidden">
                                        <img src="http://localhost:8080/profile-images/1744640026597-177124585.png" alt="Team Member Image" className="w-full duration-[400ms] group-hover:scale-110" />
                                    </div>

                                    <div className="et-member__txt bg-white relative z-[1] mx-[25px] md:mx-[15px] xs:mx-[5px] -mt-[44px] md:-mt-[15px] xs:mt-0 rounded-[16px] shadow-[0_4px_60px_rgba(18,96,254,0.12)] px-[25px] md:px-[15px] pb-[30px] md:pb-[20px] before:w-full before:absolute before:-z-[1] before:h-full before:bg-white before:left-0 before:rounded-[16px] before:-top-[33px] before:skew-y-[4deg]">
                                        <div className="et-member-socials absolute right-[20px] -top-[43px]">
                                             <div className="et-speaker__socials flex flex-col gap-[8px] absolute -z-[2] text-[14px] opacity-0 transition duration-[400ms] bottom-[calc(100%+8px)] translate-y-[100%] group-hover:translate-y-0 group-hover:opacity-100">
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-twitter"></i></a>
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-linkedin-in"></i></a>
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-instagram"></i></a>
                                            </div>
                                            <div className="et-member-socials__icon w-[36px] aspect-square rounded-full bg-etBlue flex items-center justify-center">
                                                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.89361 9.41703C9.22284 9.41703 8.61849 9.70668 8.19906 10.1675L4.42637 7.83088C4.52995 7.56611 4.58305 7.28429 4.58294 6.99999C4.58307 6.71568 4.52997 6.43386 4.42637 6.16909L8.19906 3.83238C8.61851 4.29318 9.22284 4.58297 9.89361 4.58297C11.1572 4.58297 12.1851 3.55501 12.1851 2.29143C12.1851 1.02785 11.1572 0 9.89361 0C8.63005 0 7.60209 1.02796 7.60209 2.29154C7.60204 2.57583 7.65514 2.85763 7.75866 3.1224L3.98608 5.45903C3.56663 4.99824 2.96231 4.70845 2.29154 4.70845C1.02796 4.70845 0 5.73652 0 6.99999C0 8.26354 1.02796 9.29152 2.29154 9.29152C2.96228 9.29152 3.56666 9.00185 3.98608 8.54094L7.75869 10.8776C7.65515 11.1424 7.60204 11.4242 7.60209 11.7085C7.60209 12.972 8.63003 14 9.89361 14C11.1572 14 12.1851 12.972 12.1851 11.7086C12.1851 10.445 11.1572 9.41703 9.89361 9.41703ZM8.43766 2.29154C8.43766 1.48873 9.09082 0.835596 9.89361 0.835596C10.6964 0.835596 11.3495 1.48873 11.3495 2.29154C11.3495 3.09435 10.6964 3.74748 9.89361 3.74748C9.09079 3.74748 8.43766 3.09432 8.43766 2.29154ZM2.29154 8.45593C1.48862 8.45593 0.835487 7.80277 0.835487 6.99999C0.835487 6.1972 1.48862 5.54404 2.29154 5.54404C3.09435 5.54404 3.74737 6.1972 3.74737 6.99999C3.74737 7.80277 3.09432 8.45593 2.29154 8.45593ZM8.43766 11.7085C8.43766 10.9057 9.09082 10.2525 9.89361 10.2525C10.6964 10.2525 11.3495 10.9057 11.3495 11.7084C11.3495 12.5112 10.6964 13.1644 9.89361 13.1644C9.09079 13.1644 8.43766 12.5112 8.43766 11.7084V11.7085Z" fill="white" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h5 className="font-semibold text-[22px] md:text-[20px] text-etBlack mb-[4px]"><a href="team-member-details.html" className="hover:text-etBlue">ROLLAND Dylan</a></h5>
                                        <span className="text-etGray text-[16px]">Chef de Projet</span>
                                    </div>
                                </div>

                                <div className="et-member group">
                                    <div className="et-member__img rounded-[16px] overflow-hidden">
                                        <img src="http://localhost:8080/profile-images/1744640026597-177124585.png" alt="Team Member Image" className="w-full duration-[400ms] group-hover:scale-110" />
                                    </div>

                                    <div className="et-member__txt bg-white relative z-[1] mx-[25px] md:mx-[15px] xs:mx-[5px] -mt-[44px] md:-mt-[15px] xs:mt-0 rounded-[16px] shadow-[0_4px_60px_rgba(18,96,254,0.12)] px-[25px] md:px-[15px] pb-[30px] md:pb-[20px] before:w-full before:absolute before:-z-[1] before:h-full before:bg-white before:left-0 before:rounded-[16px] before:-top-[33px] before:skew-y-[4deg]">
                                        <div className="et-member-socials absolute right-[20px] -top-[43px]">
                                            <div className="et-speaker__socials flex flex-col gap-[8px] absolute -z-[2] text-[14px] opacity-0 transition duration-[400ms] bottom-[calc(100%+8px)] translate-y-[100%] group-hover:translate-y-0 group-hover:opacity-100">
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-twitter"></i></a>
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-linkedin-in"></i></a>
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-instagram"></i></a>
                                            </div>
                                            <div className="et-member-socials__icon w-[36px] aspect-square rounded-full bg-etBlue flex items-center justify-center">
                                                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.89361 9.41703C9.22284 9.41703 8.61849 9.70668 8.19906 10.1675L4.42637 7.83088C4.52995 7.56611 4.58305 7.28429 4.58294 6.99999C4.58307 6.71568 4.52997 6.43386 4.42637 6.16909L8.19906 3.83238C8.61851 4.29318 9.22284 4.58297 9.89361 4.58297C11.1572 4.58297 12.1851 3.55501 12.1851 2.29143C12.1851 1.02785 11.1572 0 9.89361 0C8.63005 0 7.60209 1.02796 7.60209 2.29154C7.60204 2.57583 7.65514 2.85763 7.75866 3.1224L3.98608 5.45903C3.56663 4.99824 2.96231 4.70845 2.29154 4.70845C1.02796 4.70845 0 5.73652 0 6.99999C0 8.26354 1.02796 9.29152 2.29154 9.29152C2.96228 9.29152 3.56666 9.00185 3.98608 8.54094L7.75869 10.8776C7.65515 11.1424 7.60204 11.4242 7.60209 11.7085C7.60209 12.972 8.63003 14 9.89361 14C11.1572 14 12.1851 12.972 12.1851 11.7086C12.1851 10.445 11.1572 9.41703 9.89361 9.41703ZM8.43766 2.29154C8.43766 1.48873 9.09082 0.835596 9.89361 0.835596C10.6964 0.835596 11.3495 1.48873 11.3495 2.29154C11.3495 3.09435 10.6964 3.74748 9.89361 3.74748C9.09079 3.74748 8.43766 3.09432 8.43766 2.29154ZM2.29154 8.45593C1.48862 8.45593 0.835487 7.80277 0.835487 6.99999C0.835487 6.1972 1.48862 5.54404 2.29154 5.54404C3.09435 5.54404 3.74737 6.1972 3.74737 6.99999C3.74737 7.80277 3.09432 8.45593 2.29154 8.45593ZM8.43766 11.7085C8.43766 10.9057 9.09082 10.2525 9.89361 10.2525C10.6964 10.2525 11.3495 10.9057 11.3495 11.7084C11.3495 12.5112 10.6964 13.1644 9.89361 13.1644C9.09079 13.1644 8.43766 12.5112 8.43766 11.7084V11.7085Z" fill="white" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h5 className="font-semibold text-[22px] md:text-[20px] text-etBlack mb-[4px]"><a href="team-member-details.html" className="hover:text-etBlue">ISNARD Sacha</a></h5>
                                        <span className="text-etGray text-[16px]">Nursing Assistant</span>
                                    </div>
                                </div>

                                <div className="et-member group">
                                    <div className="et-member__img rounded-[16px] overflow-hidden">
                                        <img src="http://localhost:8080/profile-images/1744640026597-177124585.png" alt="Team Member Image" className="w-full duration-[400ms] group-hover:scale-110" />
                                    </div>

                                    <div className="et-member__txt bg-white relative z-[1] mx-[25px] md:mx-[15px] xs:mx-[5px] -mt-[44px] md:-mt-[15px] xs:mt-0 rounded-[16px] shadow-[0_4px_60px_rgba(18,96,254,0.12)] px-[25px] md:px-[15px] pb-[30px] md:pb-[20px] before:w-full before:absolute before:-z-[1] before:h-full before:bg-white before:left-0 before:rounded-[16px] before:-top-[33px] before:skew-y-[4deg]">
                                        <div className="et-member-socials absolute right-[20px] -top-[43px]">
                                            <div className="et-speaker__socials flex flex-col gap-[8px] absolute -z-[2] text-[14px] opacity-0 transition duration-[400ms] bottom-[calc(100%+8px)] translate-y-[100%] group-hover:translate-y-0 group-hover:opacity-100">
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-twitter"></i></a>
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-linkedin-in"></i></a>
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-instagram"></i></a>
                                            </div>
                                            <div className="et-member-socials__icon w-[36px] aspect-square rounded-full bg-etBlue flex items-center justify-center">
                                                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.89361 9.41703C9.22284 9.41703 8.61849 9.70668 8.19906 10.1675L4.42637 7.83088C4.52995 7.56611 4.58305 7.28429 4.58294 6.99999C4.58307 6.71568 4.52997 6.43386 4.42637 6.16909L8.19906 3.83238C8.61851 4.29318 9.22284 4.58297 9.89361 4.58297C11.1572 4.58297 12.1851 3.55501 12.1851 2.29143C12.1851 1.02785 11.1572 0 9.89361 0C8.63005 0 7.60209 1.02796 7.60209 2.29154C7.60204 2.57583 7.65514 2.85763 7.75866 3.1224L3.98608 5.45903C3.56663 4.99824 2.96231 4.70845 2.29154 4.70845C1.02796 4.70845 0 5.73652 0 6.99999C0 8.26354 1.02796 9.29152 2.29154 9.29152C2.96228 9.29152 3.56666 9.00185 3.98608 8.54094L7.75869 10.8776C7.65515 11.1424 7.60204 11.4242 7.60209 11.7085C7.60209 12.972 8.63003 14 9.89361 14C11.1572 14 12.1851 12.972 12.1851 11.7086C12.1851 10.445 11.1572 9.41703 9.89361 9.41703ZM8.43766 2.29154C8.43766 1.48873 9.09082 0.835596 9.89361 0.835596C10.6964 0.835596 11.3495 1.48873 11.3495 2.29154C11.3495 3.09435 10.6964 3.74748 9.89361 3.74748C9.09079 3.74748 8.43766 3.09432 8.43766 2.29154ZM2.29154 8.45593C1.48862 8.45593 0.835487 7.80277 0.835487 6.99999C0.835487 6.1972 1.48862 5.54404 2.29154 5.54404C3.09435 5.54404 3.74737 6.1972 3.74737 6.99999C3.74737 7.80277 3.09432 8.45593 2.29154 8.45593ZM8.43766 11.7085C8.43766 10.9057 9.09082 10.2525 9.89361 10.2525C10.6964 10.2525 11.3495 10.9057 11.3495 11.7084C11.3495 12.5112 10.6964 13.1644 9.89361 13.1644C9.09079 13.1644 8.43766 12.5112 8.43766 11.7084V11.7085Z" fill="white" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h5 className="font-semibold text-[22px] md:text-[20px] text-etBlack mb-[4px]"><a href="team-member-details.html" className="hover:text-etBlue">GONZALEZ Anthony</a></h5>
                                        <span className="text-etGray text-[16px]">President of Sales</span>
                                    </div>
                                </div>

                                <div className="et-member group">
                                    <div className="et-member__img rounded-[16px] overflow-hidden">
                                        <img src="http://localhost:8080/profile-images/1744640026597-177124585.png" alt="Team Member Image" className="w-full duration-[400ms] group-hover:scale-110" />
                                    </div>

                                    <div className="et-member__txt bg-white relative z-[1] mx-[25px] md:mx-[15px] xs:mx-[5px] -mt-[44px] md:-mt-[15px] xs:mt-0 rounded-[16px] shadow-[0_4px_60px_rgba(18,96,254,0.12)] px-[25px] md:px-[15px] pb-[30px] md:pb-[20px] before:w-full before:absolute before:-z-[1] before:h-full before:bg-white before:left-0 before:rounded-[16px] before:-top-[33px] before:skew-y-[4deg]">
                                        <div className="et-member-socials absolute right-[20px] -top-[43px]">
                                            <div className="et-speaker__socials flex flex-col gap-[8px] absolute -z-[2] text-[14px] opacity-0 transition duration-[400ms] bottom-[calc(100%+8px)] translate-y-[100%] group-hover:translate-y-0 group-hover:opacity-100">
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-twitter"></i></a>
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-linkedin-in"></i></a>
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-instagram"></i></a>
                                            </div>
                                            <div className="et-member-socials__icon w-[36px] aspect-square rounded-full bg-etBlue flex items-center justify-center">
                                                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.89361 9.41703C9.22284 9.41703 8.61849 9.70668 8.19906 10.1675L4.42637 7.83088C4.52995 7.56611 4.58305 7.28429 4.58294 6.99999C4.58307 6.71568 4.52997 6.43386 4.42637 6.16909L8.19906 3.83238C8.61851 4.29318 9.22284 4.58297 9.89361 4.58297C11.1572 4.58297 12.1851 3.55501 12.1851 2.29143C12.1851 1.02785 11.1572 0 9.89361 0C8.63005 0 7.60209 1.02796 7.60209 2.29154C7.60204 2.57583 7.65514 2.85763 7.75866 3.1224L3.98608 5.45903C3.56663 4.99824 2.96231 4.70845 2.29154 4.70845C1.02796 4.70845 0 5.73652 0 6.99999C0 8.26354 1.02796 9.29152 2.29154 9.29152C2.96228 9.29152 3.56666 9.00185 3.98608 8.54094L7.75869 10.8776C7.65515 11.1424 7.60204 11.4242 7.60209 11.7085C7.60209 12.972 8.63003 14 9.89361 14C11.1572 14 12.1851 12.972 12.1851 11.7086C12.1851 10.445 11.1572 9.41703 9.89361 9.41703ZM8.43766 2.29154C8.43766 1.48873 9.09082 0.835596 9.89361 0.835596C10.6964 0.835596 11.3495 1.48873 11.3495 2.29154C11.3495 3.09435 10.6964 3.74748 9.89361 3.74748C9.09079 3.74748 8.43766 3.09432 8.43766 2.29154ZM2.29154 8.45593C1.48862 8.45593 0.835487 7.80277 0.835487 6.99999C0.835487 6.1972 1.48862 5.54404 2.29154 5.54404C3.09435 5.54404 3.74737 6.1972 3.74737 6.99999C3.74737 7.80277 3.09432 8.45593 2.29154 8.45593ZM8.43766 11.7085C8.43766 10.9057 9.09082 10.2525 9.89361 10.2525C10.6964 10.2525 11.3495 10.9057 11.3495 11.7084C11.3495 12.5112 10.6964 13.1644 9.89361 13.1644C9.09079 13.1644 8.43766 12.5112 8.43766 11.7084V11.7085Z" fill="white" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h5 className="font-semibold text-[22px] md:text-[20px] text-etBlack mb-[4px]"><a href="team-member-details.html" className="hover:text-etBlue">VANNSON Tim</a></h5>
                                        <span className="text-etGray text-[16px]">President of Sales</span>
                                    </div>
                                </div>

                                <div className="et-member group">
                                    <div className="et-member__img rounded-[16px] overflow-hidden">
                                        <img src="http://localhost:8080/profile-images/1744640026597-177124585.png" alt="Team Member Image" className="w-full duration-[400ms] group-hover:scale-110" />
                                    </div>

                                    <div className="et-member__txt bg-white relative z-[1] mx-[25px] md:mx-[15px] xs:mx-[5px] -mt-[44px] md:-mt-[15px] xs:mt-0 rounded-[16px] shadow-[0_4px_60px_rgba(18,96,254,0.12)] px-[25px] md:px-[15px] pb-[30px] md:pb-[20px] before:w-full before:absolute before:-z-[1] before:h-full before:bg-white before:left-0 before:rounded-[16px] before:-top-[33px] before:skew-y-[4deg]">
                                        <div className="et-member-socials absolute right-[20px] -top-[43px]">
                                            <div className="et-speaker__socials flex flex-col gap-[8px] absolute -z-[2] text-[14px] opacity-0 transition duration-[400ms] bottom-[calc(100%+8px)] translate-y-[100%] group-hover:translate-y-0 group-hover:opacity-100">
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-twitter"></i></a>
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-linkedin-in"></i></a>
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-instagram"></i></a>
                                            </div>
                                            <div className="et-member-socials__icon w-[36px] aspect-square rounded-full bg-etBlue flex items-center justify-center">
                                                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.89361 9.41703C9.22284 9.41703 8.61849 9.70668 8.19906 10.1675L4.42637 7.83088C4.52995 7.56611 4.58305 7.28429 4.58294 6.99999C4.58307 6.71568 4.52997 6.43386 4.42637 6.16909L8.19906 3.83238C8.61851 4.29318 9.22284 4.58297 9.89361 4.58297C11.1572 4.58297 12.1851 3.55501 12.1851 2.29143C12.1851 1.02785 11.1572 0 9.89361 0C8.63005 0 7.60209 1.02796 7.60209 2.29154C7.60204 2.57583 7.65514 2.85763 7.75866 3.1224L3.98608 5.45903C3.56663 4.99824 2.96231 4.70845 2.29154 4.70845C1.02796 4.70845 0 5.73652 0 6.99999C0 8.26354 1.02796 9.29152 2.29154 9.29152C2.96228 9.29152 3.56666 9.00185 3.98608 8.54094L7.75869 10.8776C7.65515 11.1424 7.60204 11.4242 7.60209 11.7085C7.60209 12.972 8.63003 14 9.89361 14C11.1572 14 12.1851 12.972 12.1851 11.7086C12.1851 10.445 11.1572 9.41703 9.89361 9.41703ZM8.43766 2.29154C8.43766 1.48873 9.09082 0.835596 9.89361 0.835596C10.6964 0.835596 11.3495 1.48873 11.3495 2.29154C11.3495 3.09435 10.6964 3.74748 9.89361 3.74748C9.09079 3.74748 8.43766 3.09432 8.43766 2.29154ZM2.29154 8.45593C1.48862 8.45593 0.835487 7.80277 0.835487 6.99999C0.835487 6.1972 1.48862 5.54404 2.29154 5.54404C3.09435 5.54404 3.74737 6.1972 3.74737 6.99999C3.74737 7.80277 3.09432 8.45593 2.29154 8.45593ZM8.43766 11.7085C8.43766 10.9057 9.09082 10.2525 9.89361 10.2525C10.6964 10.2525 11.3495 10.9057 11.3495 11.7084C11.3495 12.5112 10.6964 13.1644 9.89361 13.1644C9.09079 13.1644 8.43766 12.5112 8.43766 11.7084V11.7085Z" fill="white" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h5 className="font-semibold text-[22px] md:text-[20px] text-etBlack mb-[4px]"><a href="team-member-details.html" className="hover:text-etBlue">PEREZ Alexandre</a></h5>
                                        <span className="text-etGray text-[16px]">Marketing Coordinator</span>
                                    </div>
                                </div>

                                <div className="et-member group">
                                    <div className="et-member__img rounded-[16px] overflow-hidden">
                                        <img src="http://localhost:8080/profile-images/1744640026597-177124585.png" className="w-full duration-[400ms] group-hover:scale-110" />
                                    </div>

                                    <div className="et-member__txt bg-white relative z-[1] mx-[25px] md:mx-[15px] xs:mx-[5px] -mt-[44px] md:-mt-[15px] xs:mt-0 rounded-[16px] shadow-[0_4px_60px_rgba(18,96,254,0.12)] px-[25px] md:px-[15px] pb-[30px] md:pb-[20px] before:w-full before:absolute before:-z-[1] before:h-full before:bg-white before:left-0 before:rounded-[16px] before:-top-[33px] before:skew-y-[4deg]">
                                        <div className="et-member-socials absolute right-[20px] -top-[43px]">
                                            <div className="et-speaker__socials flex flex-col gap-[8px] absolute -z-[2] text-[14px] opacity-0 transition duration-[400ms] bottom-[calc(100%+8px)] translate-y-[100%] group-hover:translate-y-0 group-hover:opacity-100">
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-twitter"></i></a>
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-linkedin-in"></i></a>
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-instagram"></i></a>
                                            </div>
                                            <div className="et-member-socials__icon w-[36px] aspect-square rounded-full bg-etBlue flex items-center justify-center">
                                                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.89361 9.41703C9.22284 9.41703 8.61849 9.70668 8.19906 10.1675L4.42637 7.83088C4.52995 7.56611 4.58305 7.28429 4.58294 6.99999C4.58307 6.71568 4.52997 6.43386 4.42637 6.16909L8.19906 3.83238C8.61851 4.29318 9.22284 4.58297 9.89361 4.58297C11.1572 4.58297 12.1851 3.55501 12.1851 2.29143C12.1851 1.02785 11.1572 0 9.89361 0C8.63005 0 7.60209 1.02796 7.60209 2.29154C7.60204 2.57583 7.65514 2.85763 7.75866 3.1224L3.98608 5.45903C3.56663 4.99824 2.96231 4.70845 2.29154 4.70845C1.02796 4.70845 0 5.73652 0 6.99999C0 8.26354 1.02796 9.29152 2.29154 9.29152C2.96228 9.29152 3.56666 9.00185 3.98608 8.54094L7.75869 10.8776C7.65515 11.1424 7.60204 11.4242 7.60209 11.7085C7.60209 12.972 8.63003 14 9.89361 14C11.1572 14 12.1851 12.972 12.1851 11.7086C12.1851 10.445 11.1572 9.41703 9.89361 9.41703ZM8.43766 2.29154C8.43766 1.48873 9.09082 0.835596 9.89361 0.835596C10.6964 0.835596 11.3495 1.48873 11.3495 2.29154C11.3495 3.09435 10.6964 3.74748 9.89361 3.74748C9.09079 3.74748 8.43766 3.09432 8.43766 2.29154ZM2.29154 8.45593C1.48862 8.45593 0.835487 7.80277 0.835487 6.99999C0.835487 6.1972 1.48862 5.54404 2.29154 5.54404C3.09435 5.54404 3.74737 6.1972 3.74737 6.99999C3.74737 7.80277 3.09432 8.45593 2.29154 8.45593ZM8.43766 11.7085C8.43766 10.9057 9.09082 10.2525 9.89361 10.2525C10.6964 10.2525 11.3495 10.9057 11.3495 11.7084C11.3495 12.5112 10.6964 13.1644 9.89361 13.1644C9.09079 13.1644 8.43766 12.5112 8.43766 11.7084V11.7085Z" fill="white" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h5 className="font-semibold text-[22px] md:text-[20px] text-etBlack mb-[4px]"><a href="team-member-details.html" className="hover:text-etBlue">HADDADA Yassine</a></h5>
                                        <span className="text-etGray text-[16px]">Medical Assistant</span>
                                    </div>
                                </div>

                                <div className="et-member group">
                                    <div className="et-member__img rounded-[16px] overflow-hidden">
                                        <img src="http://localhost:8080/profile-images/1744640026597-177124585.png" className="w-full duration-[400ms] group-hover:scale-110" />
                                    </div>

                                    <div className="et-member__txt bg-white relative z-[1] mx-[25px] md:mx-[15px] xs:mx-[5px] -mt-[44px] md:-mt-[15px] xs:mt-0 rounded-[16px] shadow-[0_4px_60px_rgba(18,96,254,0.12)] px-[25px] md:px-[15px] pb-[30px] md:pb-[20px] before:w-full before:absolute before:-z-[1] before:h-full before:bg-white before:left-0 before:rounded-[16px] before:-top-[33px] before:skew-y-[4deg]">
                                        <div className="et-member-socials absolute right-[20px] -top-[43px]">
                                            <div className="et-speaker__socials flex flex-col gap-[8px] absolute -z-[2] text-[14px] opacity-0 transition duration-[400ms] bottom-[calc(100%+8px)] translate-y-[100%] group-hover:translate-y-0 group-hover:opacity-100">
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-twitter"></i></a>
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-linkedin-in"></i></a>
                                                <a href="#" className="border border-white text-white w-[36px] h-[36px] flex items-center justify-center rounded-full hover:border-etBlue hover:bg-etBlue"><i className="fa-brands fa-instagram"></i></a>
                                            </div>
                                            <div className="et-member-socials__icon w-[36px] aspect-square rounded-full bg-etBlue flex items-center justify-center">
                                                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.89361 9.41703C9.22284 9.41703 8.61849 9.70668 8.19906 10.1675L4.42637 7.83088C4.52995 7.56611 4.58305 7.28429 4.58294 6.99999C4.58307 6.71568 4.52997 6.43386 4.42637 6.16909L8.19906 3.83238C8.61851 4.29318 9.22284 4.58297 9.89361 4.58297C11.1572 4.58297 12.1851 3.55501 12.1851 2.29143C12.1851 1.02785 11.1572 0 9.89361 0C8.63005 0 7.60209 1.02796 7.60209 2.29154C7.60204 2.57583 7.65514 2.85763 7.75866 3.1224L3.98608 5.45903C3.56663 4.99824 2.96231 4.70845 2.29154 4.70845C1.02796 4.70845 0 5.73652 0 6.99999C0 8.26354 1.02796 9.29152 2.29154 9.29152C2.96228 9.29152 3.56666 9.00185 3.98608 8.54094L7.75869 10.8776C7.65515 11.1424 7.60204 11.4242 7.60209 11.7085C7.60209 12.972 8.63003 14 9.89361 14C11.1572 14 12.1851 12.972 12.1851 11.7086C12.1851 10.445 11.1572 9.41703 9.89361 9.41703ZM8.43766 2.29154C8.43766 1.48873 9.09082 0.835596 9.89361 0.835596C10.6964 0.835596 11.3495 1.48873 11.3495 2.29154C11.3495 3.09435 10.6964 3.74748 9.89361 3.74748C9.09079 3.74748 8.43766 3.09432 8.43766 2.29154ZM2.29154 8.45593C1.48862 8.45593 0.835487 7.80277 0.835487 6.99999C0.835487 6.1972 1.48862 5.54404 2.29154 5.54404C3.09435 5.54404 3.74737 6.1972 3.74737 6.99999C3.74737 7.80277 3.09432 8.45593 2.29154 8.45593ZM8.43766 11.7085C8.43766 10.9057 9.09082 10.2525 9.89361 10.2525C10.6964 10.2525 11.3495 10.9057 11.3495 11.7084C11.3495 12.5112 10.6964 13.1644 9.89361 13.1644C9.09079 13.1644 8.43766 12.5112 8.43766 11.7084V11.7085Z" fill="white" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h5 className="font-semibold text-[22px] md:text-[20px] text-etBlack mb-[4px]"><a href="team-member-details.html" className="hover:text-etBlue">PRAT Jeremy</a></h5>
                                        <span className="text-etGray text-[16px]">Medical Assistant</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />

        </>
    );
};

export default TeamPage;