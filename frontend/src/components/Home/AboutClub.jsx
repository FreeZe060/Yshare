import React from 'react';
import { Link } from 'react-router-dom';

import '../../assets/css/style.css';

import aboutImg1 from "../../assets/img/about-soiree.jpeg";
import aboutImg2 from "../../assets/img/about-ynov-campus.png";

import aboutRoundText from "../../assets/img/logo_ynov_campus_blanc.png";
import aboutVector1 from "../../assets/img/about-3-img-vector.svg";
import aboutVector2 from "../../assets/img/about-3-img-vector-2.svg";
import aboutVector3 from "../../assets/img/about-3-vector-1.svg";
import aboutVector4 from "../../assets/img/about-3-vector-2.svg";
import aboutVector5 from "../../assets/img/about-3-vector-3.svg";

function AboutClub() {

    return (
        <section className="z-[1] relative py-[120px] md:py-[60px] xl:py-[80px] et-3-about">
            <div className="mx-[24.7em] xs:mx-[12px] xxl:mx-[40px] xxxl:mx-[15.7em]">
                <div className="flex md:flex-col items-center gap-[60px] xl:gap-[40px]">
                    <div className="flex gap-[30px] -ml-[32px] md:ml-0 max-w-[55%] md:max-w-full shrink-0 rev-slide-up">
                        <div className="z-[1] relative">
                            <img
                                src={aboutImg1}
                                alt="image"
                                className="rounded-xl w-[300px] h-[300px] object-cover"
                            />
                            <img src={aboutRoundText} alt="round text" className="top-[8%] left-[8%] -z-[1] absolute max-w-[70%] animate-[etSpin_7s_infinite_linear_forwards_reverse]" />
                        </div>
                        <div className="z-[1] relative">
                            <img
                                src={aboutImg2}
                                alt="image"
                                className="rounded-xl w-[300px] h-[300px] object-cover"
                            />
                            <div className="*:-z-[5] *:absolute">
                                <img src={aboutVector1} alt="vector" className="-top-[20px] -left-[20px]" />
                                <img src={aboutVector2} alt="vector" className="bottom-[23px] -left-[42px]" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h6 className="anim-text et-3-section-sub-title">ABOUT CLUB</h6>
                        <h2 className="max-w-[70%] xs:max-w-full anim-text et-3-section-title">Yshare</h2>
                        <div className="rev-slide-up">
                            <p className="mt-[17px] mb-[43px] text-[#8E8E93] text-[17px]">
                                YShare est un projet étudiant développé dans le cadre de notre formation à Ynov. Il a pour objectif de faciliter la gestion et la création d’événements entre étudiants. Que ce soit pour organiser des soirées, des conférences ou des activités de groupe, Yshare permet à chacun de proposer, rejoindre et suivre les événements du campus en toute simplicité.
                            </p>
                            <Link to="/aboutUs" className="et-3-btn">
                                Voir le club
                            </Link>
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
