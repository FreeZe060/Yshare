import React from 'react';
import { Link } from 'react-router-dom';

import '../assets/css/style.css';

import Header from "../components/Partials/Header";
import Footer from '../components/Partials/Footer';

import useSlideUpAnimation from '../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../hooks/Animations/useTextAnimation';

import vector1 from "../assets/img/et-3-event-vector.svg";
import vector2 from "../assets/img/breadcrumb-bg.jpg";

function NotFound() {
    useSlideUpAnimation();
    useTextAnimation();

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
                        <h1 className="font-medium text-[56px] xs:text-[45px] md:text-[50px] et-breadcrumb-title anim-text">Page introuvable</h1>
                        <ul className="inline-flex items-center gap-[10px] font-medium text-[16px]">
                            <li className="opacity-80"><Link to="/" className="hover:text-[#C320C0] anim-text">Accueil</Link></li>
                            <li><i className="fa-angle-right fa-solid"></i><i className="fa-angle-right fa-solid"></i></li>
                            <li className="current-page anim-text">404</li>
                        </ul>
                    </div>
                </section>

                <div className="py-[60px] xl:py-[40px] md:py-[30px] text-center">
                    <div className="container mx-auto max-w-[calc(100%-37.1vw)] xxxl:max-w-[calc(100%-350px)] xl:max-w-[calc(100%-170px)] px-[12px] lg:max-w-full">
                        <section class="error-container">
                            <span class="four"><span class="screen-reader-text">4</span></span>
                            <span class="zero"><span class="screen-reader-text">0</span></span>
                            <span class="four"><span class="screen-reader-text">4</span></span>
                        </section>
                        <h2 className="font-medium text-[60px] lg:text-[50px] md:text-[45px] sm:text-[40px] xxs:text-[35px] mb-[3px] anim-text">
                            <span className="text-[#E54BD0]">Oups !</span> Page introuvable
                        </h2>
                        <p className="text-[18px] text-[#E54BD0] mb-[41px] lg:mb-[31px] anim-text italic">
                            Je voulais trouver cette page… mais elle s’est perdue entre deux battements de musique...
                        </p>
                        <Link
                            to="/"
                            className="bg-[#E54BD0] h-[56px] rounded-[10px] px-[24px] inline-flex items-center justify-center gap-[10px] font-medium text-[16px] text-white hover:bg-[#c540b3]"
                        >
                            Retourner à l'accueil <i className="fa-solid fa-arrow-right-long"></i>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default NotFound;
