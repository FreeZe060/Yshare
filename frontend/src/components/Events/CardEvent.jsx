import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { getFormattedDayAndMonthYear, capitalizeFirstLetter, formatEuro } from '../../utils/format';
import ParticipantAvatars from '../Home/ParticipantAvatars';
import EventStatusTag from './EventStatusTag';
import EventCategoryTag from './EventCategoryTag';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const CardEvent = ({ event, isAuthenticated, isFavoris, toggleFavoris, onDeleteEvent }) => {
    const mainImageUrl = event.image
        ? (event.image.startsWith('http')
            ? event.image
            : `${event.image}`)
        : event.EventImages?.find(img => img.is_main)?.image_url
            ? `${event.EventImages.find(img => img.is_main).image_url}`
            : '/default.jpg';

    const [localStatus, setLocalStatus] = useState(event.status);

    const handleStatusChange = (newStatus) => {
        setLocalStatus(newStatus);
    };

    const MySwal = withReactContent(Swal);

    const handleDeleteClick = async () => {
        if (!onDeleteEvent) return;

        const result = await MySwal.fire({
            title: 'Êtes-vous sûr ?',
            text: "Cette action est irréversible !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                await onDeleteEvent(event.id);
                await MySwal.fire(
                    'Supprimé !',
                    'L’événement a été supprimé.',
                    'success'
                );
            } catch (error) {
                console.error("Erreur suppression événement :", error);
                await MySwal.fire(
                    'Erreur',
                    "La suppression a échoué. Veuillez réessayer.",
                    'error'
                );
            }
        }
    };

    console.log('CardEvent rendered for event:', event);

    return (
        <div className="relative flex flex-row md:flex-col items-center gap-[40px] md:gap-4 py-[30px] md:py-6 border-[#8E8E93]/25 border-b rev-slide-up">
            {isAuthenticated && typeof isFavoris === 'function' && (
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

            <div className="relative gap-2 w-[120px] md:w-20 text-center shrink-0">
                <h5 className="mb-3 text-[#BF1FC0] text-[24px] md:text-[20px]">
                    <span className="block font-semibold text-[48px] text-etBlack md:text-[36px] leading-[0.7]">
                        {getFormattedDayAndMonthYear(event.start_time).day}
                    </span>
                    <span className="block text-[20px] md:text-[16px]">
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

            <div className="w-auto md:w-full shrink-0">
                <img
                    src={mainImageUrl}
                    alt="Image de l'événement"
                    className="rounded-xl w-full max-w-[300px] md:max-w-full object-cover aspect-[300/128]"
                />
            </div>

            <div className="flex flex-row md:flex-col items-center gap-[38px] md:gap-4 min-w-0 grow">
                <div className="min-w-0">
                    <Link to={`/event/${event.id}`}>
                        <h3 className="mb-[11px] md:mb-2 font-semibold text-[30px] text-etBlack md:text-[24px] hover:text-[#BF1FC0] md:text-center truncate tracking-[-1px] transition-colors duration-300 cursor-pointer anim-text">
                            {capitalizeFirstLetter(event.title)}
                        </h3>
                    </Link>
                    <h6 className="text-[#BF1FC0] text-[17px] md:text-[15px]">
                        <span><i className="mr-2 fas fa-map-marker-alt"></i></span>
                        {capitalizeFirstLetter(event.city)}, {event.street_number} {event.street}
                    </h6>
                    {event.Categories?.length > 0 && (
                        event.Categories.map((category, index) => (
                            <EventCategoryTag
                                key={index}
                                category={category.name}
                                className="mt-2 mr-2"
                            />
                        ))
                    )}
                </div>
                <h4 className="ml-auto md:ml-0 font-semibold text-[#BF1FC0] text-[24px] md:text-[30px] text-center whitespace-nowrap">
                    {formatEuro(event.price)}
                </h4>
            </div>

            <div className="flex flex-col justify-center items-center pt-0 md:pt-4 pl-[40px] md:pl-0 border-[#8E8E93]/25 border-t-0 md:border-t border-l md:border-l-0 text-center shrink-0">
                <ParticipantAvatars eventId={event.id} />
                <Link to={`/event/${event.id}`} className="mt-4 md:mt-2 w-auto md:w-full et-3-btn min-w-[230px]">
                    Voir l'événement
                </Link>

                {event.participants && event.participants.length >= 1 && (
                    <Link
                        to={`/event/${event.id}/participants`}
                        className="mt-2 md:mt-2 w-auto md:w-full et-3-btn min-w-[230px]"
                    >
                        Voir tous les participants
                    </Link>
                )}

                {onDeleteEvent && (
                    <button
                        onClick={handleDeleteClick}
                        className="mt-4 md:mt-2 w-auto md:w-full et-3-btn min-w-[230px]"
                    >
                        Supprimer
                    </button>
                )}
            </div>
        </div>
    );
};

export default CardEvent;
