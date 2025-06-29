import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import Swal from 'sweetalert2';

import '../assets/css/style.css';

import Header from "../components/Partials/Header";
import Footer from '../components/Partials/Footer';

import useSlideUpAnimation from '../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../hooks/Animations/useTextAnimation';

import vector1 from "../assets/img/et-3-event-vector.svg";
import vector2 from "../assets/img/et-3-event-vector-2.svg";

import AboutClub from '../components/Home/AboutClub';
import Team from '../components/Home/Team';
import Contact from '../components/AboutUs/Contact';

function AboutUs() {
    useSlideUpAnimation();
    useTextAnimation();

    return (
        <>
            <Header />
            <main className="">
                <section style={{
                    backgroundImage: `linear-gradient(to top right, #580FCA, #F929BB), url(${vector1})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundBlendMode: 'overlay',
                }}
                    className="z-[1] before:-z-[1] before:absolute relative bg-gradient-to-tr from-[#580FCA] to-[#F929BB] before:bg-cover before:bg-center before:opacity-30 pt-[210px] sm:pt-[160px] lg:pt-[190px] pb-[130px] sm:pb-[80px] lg:pb-[110px] et-breadcrumb">
                    <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full text-white text-center container">
                        <h1 className="font-medium text-[56px] xs:text-[45px] md:text-[50px] et-breadcrumb-title anim-text">Tous les événements</h1>
                        <ul className="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li className="opacity-80"><a href="/" className="hover:text-[#C320C0] anim-text">Home</a></li>
                            <li><i className="fa-angle-right fa-solid"></i><i className="fa-angle-right fa-solid"></i></li>
                            <li className="current-page anim-text">À Propos de Nous</li>
                        </ul>
                    </div>
                </section>

                <AboutClub />

                <Team />

                <Contact />

            </main>
            <Footer />
        </>

    );
}

export default AboutUs;