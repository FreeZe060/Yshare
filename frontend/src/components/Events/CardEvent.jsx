import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { getFormattedDayAndMonthYear, capitalizeFirstLetter, formatEuro } from '../../utils/format';
import ParticipantAvatars from '../Home/ParticipantAvatars';
import EventStatusTag from '../../utils/EventStatusTag';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

const CardEvent = ({ event, isAuthenticated, isFavoris, toggleFavoris }) => {
    const mainImage = event.EventImages?.find(img => img.is_main) || event.EventImages?.[0];
    const imageUrl = mainImage?.image_url?.startsWith('http')
        ? mainImage.image_url
        : `${API_BASE_URL}${mainImage?.image_url || ''}`;

    return (
        <div className="relative flex lg:flex-wrap flex-nowrap items-center gap-[40px] py-[30px] border-[#8E8E93]/25 border-b rev-slide-up">
            {isAuthenticated && (
                <div
                    className={`absolute top-3 right-3 cursor-pointer text-xl transition-all duration-300 transform 
            ${isFavoris(event.id) ? 'text-red-600 hover:scale-110' : 'text-gray-400 hover:scale-110'}`}
                    onClick={() => toggleFavoris(event.id)}
                >
                    {isFavoris(event.id) ? (
                        <FaHeart className="animate-pulse" />
                    ) : (
                        <FaRegHeart />
                    )}
                </div>
            )}

            <h5 className="w-[120px] text-[24px] text-etBlue text-center shrink-0">
                <span className="block font-semibold text-[48px] text-etBlack leading-[0.7]">
                    {getFormattedDayAndMonthYear(event.start_time).day}
                </span>
                {getFormattedDayAndMonthYear(event.start_time).monthYear}
            </h5>

            <div className="shrink-0">
                <img
                    src={imageUrl}
                    alt="Image de l'événement"
                    className="rounded-xl w-full max-w-[300px] object-cover aspect-[300/128]"
                />
            </div>

            <div className="flex items-center gap-[78px] lg:gap-[38px] min-w-0 grow">
                <div className="min-w-0">
                    <Link to={`/event/${event.id}`}>
                        <h3 className="mb-[11px] font-semibold text-[30px] text-etBlack hover:text-etBlue truncate tracking-[-1px] transition-all duration-300 cursor-pointer anim-text">
                            {capitalizeFirstLetter(event.title)}
                        </h3>
                    </Link>
                    <h6 className="text-[17px] text-etBlue">
                        <span><i className="mr-2 fas fa-map-marker-alt"></i></span>
                        {capitalizeFirstLetter(event.city)}, {event.street_number} {event.street}
                    </h6>
                    <EventStatusTag date={event.start_time} status={event.status} />
                </div>
                <h4 className="ml-auto font-semibold text-[30px] text-etBlue whitespace-nowrap">
                    {formatEuro(event.price)}
                </h4>
            </div>

            <div className="pl-[40px] border-[#8E8E93]/25 border-l text-center shrink-0">
                <ParticipantAvatars eventId={event.id} />
                <Link to={`/event/${event.id}`} className="et-3-btn">
                    Voir l'événement
                </Link>
            </div>
        </div>
    );
};

export default CardEvent;
