import React from 'react';
import '../assets/css/style.css';

import aboutVector1 from "../assets/img/about-3-img-vector.svg";
import aboutVector2 from "../assets/img/about-3-img-vector-2.svg";
import aboutVector3 from "../assets/img/about-3-vector-1.svg";
import aboutVector4 from "../assets/img/about-3-vector-2.svg";
import aboutVector5 from "../assets/img/about-3-vector-3.svg";
import aboutRoundText from "../assets/img/about-3-round-text.svg";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function AboutClub({ event }) {
	if (!event) return null;

	const mainImage = event.EventImages?.find(img => img.is_main) || event.EventImages?.[0];
	const secondaryImage = event.EventImages?.find(img => !img.is_main) || event.EventImages?.[1];

	const getImageUrl = (img) =>
		img?.image_url?.startsWith('http')
			? img.image_url
			: `${API_BASE_URL}${img?.image_url || ''}`;

	return (
		<section className="z-[1] relative py-[120px] md:py-[60px] xl:py-[80px] et-3-about">
			<div className="mx-[24.7em] xs:mx-[12px] xxxl:mx-[15.7em] xxl:mx-[40px]">
				<div className="flex md:flex-col items-center gap-[60px] xl:gap-[40px]">

					{/* === Image Bloc === */}
					<div className="flex gap-[30px] -ml-[32px] md:ml-0 max-w-[55%] md:max-w-full shrink-0 rev-slide-up">
						<div className="z-[1] relative w-[1200px]">
							<img src={getImageUrl(mainImage)} alt="main event" className="w-full h-full object-cover rounded-xl" />
							<img src={aboutRoundText} alt="round text" className="top-[8%] left-[8%] -z-[1] absolute max-w-[86%] animate-[etSpin_7s_infinite_linear_forwards_reverse]" />
						</div>

						{secondaryImage && (
							<div className="z-[1] relative">
								<img src={getImageUrl(secondaryImage)} alt="secondary event" />
								<div className="*:-z-[5] *:absolute">
									<img src={aboutVector1} alt="vector" className="-top-[20px] -left-[20px]" />
									<img src={aboutVector2} alt="vector" className="bottom-[23px] -left-[42px]" />
								</div>
							</div>
						)}
					</div>

					<div>
						<h6 className="anim-text et-3-section-sub-title">ABOUT CLUB</h6>
						<h2 className="anim-text max-w-[70%] xs:max-w-full et-3-section-title">{event.title}</h2>
						<div className="rev-slide-up">
							<p className="mt-[17px] mb-[20px] text-[#8E8E93] text-[17px]">
								{event.description}
							</p>

							<p className="mb-[30px] text-[17px] text-[#8E8E93] font-semibold">
								Participants : {event.participants?.length || 0} / {event.max_participants || '∞'}
							</p>

							<a href="#" className="et-3-btn">
								<span className="icon">🎟️</span>
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
