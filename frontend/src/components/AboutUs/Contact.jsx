import React from 'react';

import BgImage from "../../assets/img/breadcrumb-bg.jpg";
import callIcon from "../../assets/img/call-msg.svg";
import mailIcon from "../../assets/img/mail.svg";
import locationIcon from "../../assets/img/location-dot-circle.svg";

const Contact = () => {
    return (
        <main>
            <section className="py-[120px] xl:py-[80px] md:py-[60px]">
                <div className="container mx-auto max-w-[1200px] px-[12px] xl:max-w-full">
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-[60px] xl:gap-[40px] items-center">

                        {/* Infos de contact */}
                        <div>
                            <div className="bg-gradient-to-tr from-[#580FCA] to-[#F929BB] p-[40px] sm:p-[30px] space-y-[24px] text-[16px] text-white">
                                <div className="flex flex-wrap items-center gap-[20px] pb-[20px] border-b border-white/30">
                                    <span className="icon shrink-0 border border-dashed border-white rounded-full h-[62px] w-[62px] flex items-center justify-center">
                                        <img src={callIcon} alt="Appeler" />
                                    </span>
                                    <div className="txt">
                                        <span className="font-light">Appelez-nous</span>
                                        <h4 className="font-semibold text-[24px]"><a href="tel:+33000000000">+33 0 00 00 00 00</a></h4>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-[20px] pb-[20px] border-b border-white/30">
                                    <span className="icon shrink-0 border border-dashed border-white rounded-full h-[62px] w-[62px] flex items-center justify-center">
                                        <img src={mailIcon} alt="Mail" />
                                    </span>
                                    <div className="txt">
                                        <span className="font-light">Envoyez-nous un mail</span>
                                        <h4 className="font-semibold text-[24px]"><a href="mailto:tim.vannson@ynov.com">tim.vannson@ynov.com</a></h4>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-[20px]">
                                    <span className="icon shrink-0 border border-dashed border-white rounded-full h-[62px] w-[62px] flex items-center justify-center">
                                        <img src={locationIcon} alt="Localisation" />
                                    </span>
                                    <div className="txt">
                                        <span className="font-light">Adresse</span>
                                        <h4 className="font-semibold text-[24px]">Ynov Sophia Campus</h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Formulaire de contact */}
                        <div>
                            <h2 className="text-[40px] md:text-[35px] sm:text-[30px] xxs:text-[28px] font-medium text-etBlack mb-[7px]">Besoin d'Aide ?</h2>
                            <p className="text-etGray font-light text-[16px] mb-[38px]">Contactez-nous pour toute question. Nous vous répondrons rapidement.</p>

                            <form action="#" className="grid grid-cols-2 xxs:grid-cols-1 gap-[30px] xs:gap-[20px] text-[16px]">
                                <div>
                                    <label htmlFor="contact-name" className="font-lato font-semibold text-etBlack block mb-[12px]">Votre Nom*</label>
                                    <input type="text" name="name" id="contact-name" placeholder="Votre Nom" className="border border-[#ECECEC] h-[55px] px-[20px] xs:px-[15px] rounded-[4px] w-full focus:outline-none" />
                                </div>
                                <div>
                                    <label htmlFor="contact-email" className="font-lato font-semibold text-etBlack block mb-[12px]">Votre Email*</label>
                                    <input type="email" name="email" id="contact-email" placeholder="Votre Email" className="border border-[#ECECEC] h-[55px] px-[20px] xs:px-[15px] rounded-[4px] w-full focus:outline-none" />
                                </div>
                                <div className="col-span-2 xxs:col-span-1">
                                    <label htmlFor="contact-message" className="font-lato font-semibold text-etBlack block mb-[12px]">Votre Message*</label>
                                    <textarea name="message" id="contact-message" placeholder="Votre Message" className="border border-[#ECECEC] h-[145px] p-[20px] rounded-[4px] w-full focus:outline-none"></textarea>
                                </div>
                                <div>
                                    <button type="submit" className="bg-[#E54BD0] h-[55px] px-[24px] rounded-[10px] text-[16px] font-medium text-white hover:bg-[#c540b3]">Envoyer <span className="icon pl-[10px]"><i className="fa-solid fa-arrow-right-long"></i></span></button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </section>

            {/* MAP Ynov Sophia Campus */}
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2888.699743491918!2d7.066227615591756!3d43.61683376119705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12cddb8e0c436df3%3A0x6ec1c2680b3df0ad!2sPl.%20Sophie%20Laffitte%2C%2006560%20Valbonne%2C%20France!5e0!3m2!1sfr!2sfr!4v1717164456782!5m2!1sfr!2sfr"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[600px] lg:h-[500px] md:h-[400px] sm:h-[350px] rounded-lg shadow"
                title="Carte Ynov Sophia Campus"
            ></iframe>

        </main>
    );
};

export default Contact;
