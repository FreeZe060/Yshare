import React, { useState } from 'react';
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

    // ➡️ State local pour gérer le status mis à jour
    const [localStatus, setLocalStatus] = useState(event.status);

    const handleStatusChange = (newStatus) => {
        setLocalStatus(newStatus);
    };

    return (
        <div className="relative flex md:flex-col flex-row items-center md:gap-4 gap-[40px] md:py-6 py-[30px] border-b border-[#8E8E93]/25 rev-slide-up">
            {isAuthenticated && (
                <div
                    className={`absolute top-3 right-3 cursor-pointer text-xl transition-transform duration-300 
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

            {/* Date & EventStatusTag */}
            <div className="relative md:w-20 w-[120px] text-center shrink-0 gap-2">
                <h5 className="md:text-[20px] text-[24px] text-[#BF1FC0] mb-3">
                    <span className="block font-semibold md:text-[36px] text-[48px] text-etBlack leading-[0.7]">
                        {getFormattedDayAndMonthYear(event.start_time).day}
                    </span>
                    <span className="block md:text-[16px] text-[20px]">
                        {getFormattedDayAndMonthYear(event.start_time).monthYear}
                    </span>
                </h5>
                <EventStatusTag
                    date={event.start_time}
                    status={localStatus}
                    eventId={event.id}
                    onStatusChange={(newStatus) => handleStatusChange(newStatus)}
                />
            </div>

            {/* Image */}
            <div className="md:w-full w-auto shrink-0">
                <img
                    src={imageUrl}
                    alt="Image de l'événement"
                    className="rounded-xl w-full md:max-w-full max-w-[300px] object-cover aspect-[300/128]"
                />
            </div>

            <div className="flex md:flex-col flex-row items-center md:gap-4 gap-[38px] min-w-0 grow">
                <div className="min-w-0">
                    <Link to={`/event/${event.id}`}>
                        <h3 className="md:mb-2 mb-[11px] md:text-center font-semibold md:text-[24px] text-[30px] text-etBlack hover:text-[#BF1FC0] truncate tracking-[-1px] transition-colors duration-300 cursor-pointer anim-text">
                            {capitalizeFirstLetter(event.title)}
                        </h3>
                    </Link>
                    <h6 className="md:text-[15px] text-[17px] text-[#BF1FC0]">
                        <span><i className="mr-2 fas fa-map-marker-alt"></i></span>
                        {capitalizeFirstLetter(event.city)}, {event.street_number} {event.street}
                    </h6>
                </div>
                <h4 className="ml-auto md:ml-0 text-center font-semibold text-[24px] md:text-[30px] text-[#BF1FC0] whitespace-nowrap">
                    {formatEuro(event.price)}
                </h4>
            </div>

            {/* Participants + Button */}
            <div className="flex flex-col items-center justify-center pl-[40px] md:pl-0 md:border-t border-t-0 border-l md:border-l-0 border-[#8E8E93]/25 md:pt-4 pt-0 text-center shrink-0">
                <ParticipantAvatars eventId={event.id} />
                <Link to={`/event/${event.id}`} className="et-3-btn md:mt-2 mt-4 md:w-full w-auto">
                    Voir l'événement
                </Link>
            </div>
        </div>
    );
};

export default CardEvent;
