import React from 'react';
import { Link } from 'react-router-dom';

function Event_Created({
    filtered,
    API_BASE_URL,
    getFormattedDayAndMonthYear,
    capitalizeFirstLetter,
    formatEuro
}) {
    return (
        <section className="z-[1] relative py-[120px] md:py-[60px] xl:py-[80px] overflow-hidden">
            <div className="mx-auto px-[12px] max-w-[1200px] xl:max-w-full">
                {filtered.map((item, index) => {
                    const mainImage = item.EventImages?.find(img => img.is_main) || item.EventImages?.[0];
                    const imageUrl = mainImage?.image_url?.startsWith('http')
                        ? mainImage.image_url
                        : `${API_BASE_URL}${mainImage?.image_url || ''}`;

                    return (
                        <div key={index} className="relative flex lg:flex-wrap flex-nowrap items-center gap-[40px] opacity-1 py-[30px] border-[#8E8E93]/25 border-b rev-slide-up">

                            <h5 className="w-[120px] text-[24px] text-etBlue text-center shrink-0">
                                <span className="block font-semibold text-[48px] text-etBlack leading-[0.7]">
                                    {getFormattedDayAndMonthYear(item.start_time).day}
                                </span>
                                {getFormattedDayAndMonthYear(item.start_time).monthYear}
                            </h5>
                            <div className="shrink-0">
                                <img
                                    src={imageUrl}
                                    alt="Event"
                                    className="rounded-xl w-full max-w-[300px] object-cover aspect-[300/128]"
                                />
                            </div>
                            <div className="flex items-center gap-[78px] lg:gap-[38px] min-w-0 grow">
                                <div className="min-w-0">
                                    <Link to={`/event/${item.id}`}>
                                        <h3 className="mb-[11px] font-semibold text-[30px] text-etBlack hover:text-etBlue truncate tracking-[-1px] transition-all duration-300 cursor-pointer anim-text">
                                            {capitalizeFirstLetter(item.title)}
                                        </h3>
                                    </Link>
                                    <h6 className="text-[17px] text-etBlue">
                                        <span><i className="mr-2 fas fa-map-marker-alt"></i></span>
                                        {capitalizeFirstLetter(item.city)}, {item.street_number} {item.street}
                                    </h6>
                                    <div className={`text-xs font-semibold px-3 py-1 rounded-full w-fit mt-2
                                                    ${item.status === 'Planifié' ? 'bg-blue-100 text-blue-700' : ''}
                                                    ${item.status === 'En Cours' ? 'bg-green-100 text-green-700' : ''}
                                                    ${item.status === 'Terminé' ? 'bg-gray-200 text-gray-700' : ''}
                                                    ${item.status === 'Annulé' ? 'bg-red-100 text-red-700' : ''}
                                                `}>{item.status}
                                    </div>
                                </div>
                                <h4 className="ml-auto font-semibold text-[30px] text-etBlue whitespace-nowrap">
                                    {formatEuro(item.price)}
                                </h4>
                            </div>
                            <div className="pl-[40px] border-[#8E8E93]/25 border-l text-center shrink-0">

                                <Link to={`/event/${item.id}`} className="et-3-btn">
                                    Voir l'event
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default Event_Created;