import React from 'react';
import 'animate.css';
import Header from "../components/Partials/Header";
import Footer from "../components/Partials/Footer";
import vector1 from '../assets/img/et-3-event-vector.svg';

const TeamPage = () => {

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
                    className="z-[1] before:-z-[1] before:absolute relative bg-gradient-to-tr from-[#580FCA] to-[#F929BB] before:bg-cover before:bg-center before:opacity-30 pt-[210px] sm:pt-[160px] lg:pt-[190px] pb-[130px] sm:pb-[80px] lg:pb-[110px] et-breadcrumb">
                    <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full text-white text-center container">
                        <h1 className="font-medium text-[56px] xs:text-[45px] md:text-[50px] et-breadcrumb-title">Notre Équipe</h1>
                        <ul className="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li className="opacity-80 hover:text-blue-400 cursor-pointer">
                                <a href="/">Home</a>
                            </li>
                            <li><i className="fa-angle-right fa-solid"></i><i className="fa-angle-right fa-solid"></i></li>
                            <li className="current-page">Notre Équipe</li>
                        </ul>
                    </div>
                </section>

                <div className="py-[130px] md:py-[60px] lg:py-[80px]">
                    <section className="et-team">
                        <div className="mx-auto px-[12px] max-w-[1300px] container">
                            <div className="justify-center gap-[30px] lg:gap-[20px] grid grid-cols-3 xxs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                                <div className="group et-member">
                                    <div className="rounded-[16px] overflow-hidden et-member__img">
                                        <img src="http://localhost:8080/profile-images/1744640026597-177124585.png" alt="Team Member Image" className="w-full group-hover:scale-110 duration-[400ms]" />
                                    </div>

                                    <div className="before:-top-[33px] before:left-0 z-[1] before:-z-[1] before:absolute relative bg-white before:bg-white shadow-[0_4px_60px_rgba(18,96,254,0.12)] mx-[25px] xs:mx-[5px] md:mx-[15px] -mt-[44px] xs:mt-0 md:-mt-[15px] px-[25px] md:px-[15px] pb-[30px] md:pb-[20px] rounded-[16px] before:rounded-[16px] before:w-full before:h-full before:skew-y-[4deg] et-member__txt">
                                        <div className="-top-[43px] right-[20px] absolute et-member-socials">
                                            <div className="bottom-[calc(100%+8px)] -z-[2] absolute flex flex-col gap-[8px] opacity-0 group-hover:opacity-100 text-[14px] transition translate-y-[100%] group-hover:translate-y-0 duration-[400ms] et-speaker__socials">
                                                <a href="#" className="flex justify-center items-center hover:bg-etBlue border border-white hover:border-etBlue rounded-full w-[36px] h-[36px] text-white"><i className="fa-brands fa-twitter"></i></a>
                                                <a href="#" className="flex justify-center items-center hover:bg-etBlue border border-white hover:border-etBlue rounded-full w-[36px] h-[36px] text-white"><i className="fa-brands fa-linkedin-in"></i></a>
                                                <a href="#" className="flex justify-center items-center hover:bg-etBlue border border-white hover:border-etBlue rounded-full w-[36px] h-[36px] text-white"><i className="fa-brands fa-instagram"></i></a>
                                            </div>
                                            <div className="flex justify-center items-center bg-etBlue rounded-full w-[36px] aspect-square et-member-socials__icon">
                                                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.89361 9.41703C9.22284 9.41703 8.61849 9.70668 8.19906 10.1675L4.42637 7.83088C4.52995 7.56611 4.58305 7.28429 4.58294 6.99999C4.58307 6.71568 4.52997 6.43386 4.42637 6.16909L8.19906 3.83238C8.61851 4.29318 9.22284 4.58297 9.89361 4.58297C11.1572 4.58297 12.1851 3.55501 12.1851 2.29143C12.1851 1.02785 11.1572 0 9.89361 0C8.63005 0 7.60209 1.02796 7.60209 2.29154C7.60204 2.57583 7.65514 2.85763 7.75866 3.1224L3.98608 5.45903C3.56663 4.99824 2.96231 4.70845 2.29154 4.70845C1.02796 4.70845 0 5.73652 0 6.99999C0 8.26354 1.02796 9.29152 2.29154 9.29152C2.96228 9.29152 3.56666 9.00185 3.98608 8.54094L7.75869 10.8776C7.65515 11.1424 7.60204 11.4242 7.60209 11.7085C7.60209 12.972 8.63003 14 9.89361 14C11.1572 14 12.1851 12.972 12.1851 11.7086C12.1851 10.445 11.1572 9.41703 9.89361 9.41703ZM8.43766 2.29154C8.43766 1.48873 9.09082 0.835596 9.89361 0.835596C10.6964 0.835596 11.3495 1.48873 11.3495 2.29154C11.3495 3.09435 10.6964 3.74748 9.89361 3.74748C9.09079 3.74748 8.43766 3.09432 8.43766 2.29154ZM2.29154 8.45593C1.48862 8.45593 0.835487 7.80277 0.835487 6.99999C0.835487 6.1972 1.48862 5.54404 2.29154 5.54404C3.09435 5.54404 3.74737 6.1972 3.74737 6.99999C3.74737 7.80277 3.09432 8.45593 2.29154 8.45593ZM8.43766 11.7085C8.43766 10.9057 9.09082 10.2525 9.89361 10.2525C10.6964 10.2525 11.3495 10.9057 11.3495 11.7084C11.3495 12.5112 10.6964 13.1644 9.89361 13.1644C9.09079 13.1644 8.43766 12.5112 8.43766 11.7084V11.7085Z" fill="white" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h5 className="mb-[4px] font-semibold text-[22px] text-etBlack md:text-[20px]"><a href="team-member-details.html" className="hover:text-etBlue">VANNSON Tim</a></h5>
                                        <span className="text-[16px] text-etGray">Dev Backend</span>
                                    </div>
                                </div>

                                <div className="group et-member">
                                    <div className="rounded-[16px] overflow-hidden et-member__img">
                                        <img src="http://localhost:8080/profile-images/1744640026597-177124585.png" alt="Team Member Image" className="w-full group-hover:scale-110 duration-[400ms]" />
                                    </div>

                                    <div className="before:-top-[33px] before:left-0 z-[1] before:-z-[1] before:absolute relative bg-white before:bg-white shadow-[0_4px_60px_rgba(18,96,254,0.12)] mx-[25px] xs:mx-[5px] md:mx-[15px] -mt-[44px] xs:mt-0 md:-mt-[15px] px-[25px] md:px-[15px] pb-[30px] md:pb-[20px] rounded-[16px] before:rounded-[16px] before:w-full before:h-full before:skew-y-[4deg] et-member__txt">
                                        <div className="-top-[43px] right-[20px] absolute et-member-socials">
                                            <div className="bottom-[calc(100%+8px)] -z-[2] absolute flex flex-col gap-[8px] opacity-0 group-hover:opacity-100 text-[14px] transition translate-y-[100%] group-hover:translate-y-0 duration-[400ms] et-speaker__socials">
                                                <a href="#" className="flex justify-center items-center hover:bg-etBlue border border-white hover:border-etBlue rounded-full w-[36px] h-[36px] text-white"><i className="fa-brands fa-twitter"></i></a>
                                                <a href="#" className="flex justify-center items-center hover:bg-etBlue border border-white hover:border-etBlue rounded-full w-[36px] h-[36px] text-white"><i className="fa-brands fa-linkedin-in"></i></a>
                                                <a href="#" className="flex justify-center items-center hover:bg-etBlue border border-white hover:border-etBlue rounded-full w-[36px] h-[36px] text-white"><i className="fa-brands fa-instagram"></i></a>
                                            </div>
                                            <div className="flex justify-center items-center bg-etBlue rounded-full w-[36px] aspect-square et-member-socials__icon">
                                                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.89361 9.41703C9.22284 9.41703 8.61849 9.70668 8.19906 10.1675L4.42637 7.83088C4.52995 7.56611 4.58305 7.28429 4.58294 6.99999C4.58307 6.71568 4.52997 6.43386 4.42637 6.16909L8.19906 3.83238C8.61851 4.29318 9.22284 4.58297 9.89361 4.58297C11.1572 4.58297 12.1851 3.55501 12.1851 2.29143C12.1851 1.02785 11.1572 0 9.89361 0C8.63005 0 7.60209 1.02796 7.60209 2.29154C7.60204 2.57583 7.65514 2.85763 7.75866 3.1224L3.98608 5.45903C3.56663 4.99824 2.96231 4.70845 2.29154 4.70845C1.02796 4.70845 0 5.73652 0 6.99999C0 8.26354 1.02796 9.29152 2.29154 9.29152C2.96228 9.29152 3.56666 9.00185 3.98608 8.54094L7.75869 10.8776C7.65515 11.1424 7.60204 11.4242 7.60209 11.7085C7.60209 12.972 8.63003 14 9.89361 14C11.1572 14 12.1851 12.972 12.1851 11.7086C12.1851 10.445 11.1572 9.41703 9.89361 9.41703ZM8.43766 2.29154C8.43766 1.48873 9.09082 0.835596 9.89361 0.835596C10.6964 0.835596 11.3495 1.48873 11.3495 2.29154C11.3495 3.09435 10.6964 3.74748 9.89361 3.74748C9.09079 3.74748 8.43766 3.09432 8.43766 2.29154ZM2.29154 8.45593C1.48862 8.45593 0.835487 7.80277 0.835487 6.99999C0.835487 6.1972 1.48862 5.54404 2.29154 5.54404C3.09435 5.54404 3.74737 6.1972 3.74737 6.99999C3.74737 7.80277 3.09432 8.45593 2.29154 8.45593ZM8.43766 11.7085C8.43766 10.9057 9.09082 10.2525 9.89361 10.2525C10.6964 10.2525 11.3495 10.9057 11.3495 11.7084C11.3495 12.5112 10.6964 13.1644 9.89361 13.1644C9.09079 13.1644 8.43766 12.5112 8.43766 11.7084V11.7085Z" fill="white" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h5 className="mb-[4px] font-semibold text-[22px] text-etBlack md:text-[20px]"><a href="team-member-details.html" className="hover:text-etBlue">PEREZ Alexandre</a></h5>
                                        <span className="text-[16px] text-etGray">Dev Backend</span>
                                    </div>
                                </div>

                                <div className="group et-member">
                                    <div className="rounded-[16px] overflow-hidden et-member__img">
                                        <img src="http://localhost:8080/profile-images/1744640026597-177124585.png" alt="Team Member Image" className="w-full group-hover:scale-110 duration-[400ms]" />
                                    </div>

                                    <div className="before:-top-[33px] before:left-0 z-[1] before:-z-[1] before:absolute relative bg-white before:bg-white shadow-[0_4px_60px_rgba(18,96,254,0.12)] mx-[25px] xs:mx-[5px] md:mx-[15px] -mt-[44px] xs:mt-0 md:-mt-[15px] px-[25px] md:px-[15px] pb-[30px] md:pb-[20px] rounded-[16px] before:rounded-[16px] before:w-full before:h-full before:skew-y-[4deg] et-member__txt">
                                        <div className="-top-[43px] right-[20px] absolute et-member-socials">
                                            <div className="bottom-[calc(100%+8px)] -z-[2] absolute flex flex-col gap-[8px] opacity-0 group-hover:opacity-100 text-[14px] transition translate-y-[100%] group-hover:translate-y-0 duration-[400ms] et-speaker__socials">
                                                <a href="#" className="flex justify-center items-center hover:bg-etBlue border border-white hover:border-etBlue rounded-full w-[36px] h-[36px] text-white"><i className="fa-brands fa-twitter"></i></a>
                                                <a href="#" className="flex justify-center items-center hover:bg-etBlue border border-white hover:border-etBlue rounded-full w-[36px] h-[36px] text-white"><i className="fa-brands fa-linkedin-in"></i></a>
                                                <a href="#" className="flex justify-center items-center hover:bg-etBlue border border-white hover:border-etBlue rounded-full w-[36px] h-[36px] text-white"><i className="fa-brands fa-instagram"></i></a>
                                            </div>
                                            <div className="flex justify-center items-center bg-etBlue rounded-full w-[36px] aspect-square et-member-socials__icon">
                                                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.89361 9.41703C9.22284 9.41703 8.61849 9.70668 8.19906 10.1675L4.42637 7.83088C4.52995 7.56611 4.58305 7.28429 4.58294 6.99999C4.58307 6.71568 4.52997 6.43386 4.42637 6.16909L8.19906 3.83238C8.61851 4.29318 9.22284 4.58297 9.89361 4.58297C11.1572 4.58297 12.1851 3.55501 12.1851 2.29143C12.1851 1.02785 11.1572 0 9.89361 0C8.63005 0 7.60209 1.02796 7.60209 2.29154C7.60204 2.57583 7.65514 2.85763 7.75866 3.1224L3.98608 5.45903C3.56663 4.99824 2.96231 4.70845 2.29154 4.70845C1.02796 4.70845 0 5.73652 0 6.99999C0 8.26354 1.02796 9.29152 2.29154 9.29152C2.96228 9.29152 3.56666 9.00185 3.98608 8.54094L7.75869 10.8776C7.65515 11.1424 7.60204 11.4242 7.60209 11.7085C7.60209 12.972 8.63003 14 9.89361 14C11.1572 14 12.1851 12.972 12.1851 11.7086C12.1851 10.445 11.1572 9.41703 9.89361 9.41703ZM8.43766 2.29154C8.43766 1.48873 9.09082 0.835596 9.89361 0.835596C10.6964 0.835596 11.3495 1.48873 11.3495 2.29154C11.3495 3.09435 10.6964 3.74748 9.89361 3.74748C9.09079 3.74748 8.43766 3.09432 8.43766 2.29154ZM2.29154 8.45593C1.48862 8.45593 0.835487 7.80277 0.835487 6.99999C0.835487 6.1972 1.48862 5.54404 2.29154 5.54404C3.09435 5.54404 3.74737 6.1972 3.74737 6.99999C3.74737 7.80277 3.09432 8.45593 2.29154 8.45593ZM8.43766 11.7085C8.43766 10.9057 9.09082 10.2525 9.89361 10.2525C10.6964 10.2525 11.3495 10.9057 11.3495 11.7084C11.3495 12.5112 10.6964 13.1644 9.89361 13.1644C9.09079 13.1644 8.43766 12.5112 8.43766 11.7084V11.7085Z" fill="white" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h5 className="mb-[4px] font-semibold text-[22px] text-etBlack md:text-[20px]"><a href="team-member-details.html" className="hover:text-etBlue">PRAT Jeremy</a></h5>
                                        <span className="text-[16px] text-etGray">Dev Frontend</span>
                                    </div>
                                </div>

                                <div className="group et-member">
                                    <div className="rounded-[16px] overflow-hidden et-member__img">
                                        <img src="http://localhost:8080/profile-images/1744640026597-177124585.png" alt="Team Member Image" className="w-full group-hover:scale-110 duration-[400ms]" />
                                    </div>

                                    <div className="before:-top-[33px] before:left-0 z-[1] before:-z-[1] before:absolute relative bg-white before:bg-white shadow-[0_4px_60px_rgba(18,96,254,0.12)] mx-[25px] xs:mx-[5px] md:mx-[15px] -mt-[44px] xs:mt-0 md:-mt-[15px] px-[25px] md:px-[15px] pb-[30px] md:pb-[20px] rounded-[16px] before:rounded-[16px] before:w-full before:h-full before:skew-y-[4deg] et-member__txt">
                                        <div className="-top-[43px] right-[20px] absolute et-member-socials">
                                            <div className="bottom-[calc(100%+8px)] -z-[2] absolute flex flex-col gap-[8px] opacity-0 group-hover:opacity-100 text-[14px] transition translate-y-[100%] group-hover:translate-y-0 duration-[400ms] et-speaker__socials">
                                                <a href="#" className="flex justify-center items-center hover:bg-etBlue border border-white hover:border-etBlue rounded-full w-[36px] h-[36px] text-white"><i className="fa-brands fa-twitter"></i></a>
                                                <a href="#" className="flex justify-center items-center hover:bg-etBlue border border-white hover:border-etBlue rounded-full w-[36px] h-[36px] text-white"><i className="fa-brands fa-linkedin-in"></i></a>
                                                <a href="#" className="flex justify-center items-center hover:bg-etBlue border border-white hover:border-etBlue rounded-full w-[36px] h-[36px] text-white"><i className="fa-brands fa-instagram"></i></a>
                                            </div>
                                            <div className="flex justify-center items-center bg-etBlue rounded-full w-[36px] aspect-square et-member-socials__icon">
                                                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.89361 9.41703C9.22284 9.41703 8.61849 9.70668 8.19906 10.1675L4.42637 7.83088C4.52995 7.56611 4.58305 7.28429 4.58294 6.99999C4.58307 6.71568 4.52997 6.43386 4.42637 6.16909L8.19906 3.83238C8.61851 4.29318 9.22284 4.58297 9.89361 4.58297C11.1572 4.58297 12.1851 3.55501 12.1851 2.29143C12.1851 1.02785 11.1572 0 9.89361 0C8.63005 0 7.60209 1.02796 7.60209 2.29154C7.60204 2.57583 7.65514 2.85763 7.75866 3.1224L3.98608 5.45903C3.56663 4.99824 2.96231 4.70845 2.29154 4.70845C1.02796 4.70845 0 5.73652 0 6.99999C0 8.26354 1.02796 9.29152 2.29154 9.29152C2.96228 9.29152 3.56666 9.00185 3.98608 8.54094L7.75869 10.8776C7.65515 11.1424 7.60204 11.4242 7.60209 11.7085C7.60209 12.972 8.63003 14 9.89361 14C11.1572 14 12.1851 12.972 12.1851 11.7086C12.1851 10.445 11.1572 9.41703 9.89361 9.41703ZM8.43766 2.29154C8.43766 1.48873 9.09082 0.835596 9.89361 0.835596C10.6964 0.835596 11.3495 1.48873 11.3495 2.29154C11.3495 3.09435 10.6964 3.74748 9.89361 3.74748C9.09079 3.74748 8.43766 3.09432 8.43766 2.29154ZM2.29154 8.45593C1.48862 8.45593 0.835487 7.80277 0.835487 6.99999C0.835487 6.1972 1.48862 5.54404 2.29154 5.54404C3.09435 5.54404 3.74737 6.1972 3.74737 6.99999C3.74737 7.80277 3.09432 8.45593 2.29154 8.45593ZM8.43766 11.7085C8.43766 10.9057 9.09082 10.2525 9.89361 10.2525C10.6964 10.2525 11.3495 10.9057 11.3495 11.7084C11.3495 12.5112 10.6964 13.1644 9.89361 13.1644C9.09079 13.1644 8.43766 12.5112 8.43766 11.7084V11.7085Z" fill="white" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h5 className="mb-[4px] font-semibold text-[22px] text-etBlack md:text-[20px]"><a href="team-member-details.html" className="hover:text-etBlue"> SAKO Ibrahim</a></h5>
                                        <span className="text-[16px] text-etGray">Developpeur</span>
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