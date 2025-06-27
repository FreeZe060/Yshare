import React from 'react';

function EventMainRightColumn({
    event,
    handleApplyToEvent,
    ticketCount,
    handleIncrease,
    handleDecrease,
    errors,
    errorCount,
    address,
    googleMapUrl,
    formatEuro,
    editing,
    newPrice,
    setNewPrice,
    originalPrice,
    newStreetNumber,
    setNewStreetNumber,
    originalStreetNumber,
    newStreet,
    setNewStreet,
    originalStreet,
    newPostalCode,
    setNewPostalCode,
    originalPostalCode,
    newCity,
    setNewCity,
    originalCity
}) {

    return (
        <div className="right space-y-[30px] w-[370px] lg:w-[360px] max-w-full shrink-0">
            <div className="border border-[#e5e5e5] rounded-[16px] overflow-hidden et-event-details-ticket-widgget">
                <div className="bg-[#C320C0] p-[16px] xxs:p-[12px]">
                    <h5 className="font-medium text-[20px] text-white text-center">Sélectionnez la date et l’heure</h5>
                </div>

                <div className="p-[22px] lg:p-[16px]">
                    <div className="flex justify-between items-center mt-[6px] mb-[16px]">
                        <h6 className="font-medium text-[#232323] text-[16px]">Plage horaire</h6>

                        <div className="flex items-center gap-[20px] text-[16px]" id="et-event-details-ticket-time-slider-nav">
                            <button className="hover:text-[#C320C0] prev"><i className="fa-angle-left fa-solid"></i></button>
                            <button className="hover:text-[#C320C0] next"><i className="fa-angle-right fa-solid"></i></button>
                        </div>
                    </div>

                    <div className="mb-[24px] overflow-visible et-event-details-ticket-time-slider swiper">
                        <div className="swiper-wrapper">
                            <div className="group w-max swiper-slide">
                                <span className="inline-flex justify-center items-center group-[.swiper-slide-active]:bg-[#C320C0] px-[15px] border border-[#e5e5e5] group-[.swiper-slide-active]:border-etBlue rounded-[4px] h-[30px] font-inter font-normal text-[#232323] text-[14px] group-[.swiper-slide-active]:text-white cursor-pointer">
                                    {`${new Date(event?.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(event?.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    <form className="space-y-[10px] mb-[30px]">
                        <div className="px-[16px] py-[7px] border border-[#d9d9d9] rounded-[6px] radio-container">
                            <label className="relative flex gap-[15px] font-normal text-[#232323] text-[14px]">
                                <span>{`Place pour l'événement "${event?.title}"`}</span>
                                <span className="flex items-center">
                                    <input type="radio" name="options" checked readOnly className="appearance-none" />
                                    <span className="before:top-[50%] after:top-[50%] before:right-0 after:right-0 before:-z-[1] before:absolute after:absolute before:content-normal after:content-normal before:bg-white after:bg-[#C320C0] after:opacity-0 mr-[28px] after:mr-[4px] before:border before:border-etBlue before:rounded-full after:rounded-full before:w-[16px] after:w-[8px] before:h-[16px] after:h-[8px] before:-translate-y-[50%] after:-translate-y-[50%]">
                                        {editing ? (
                                            <>
                                                <input
                                                    type="number"
                                                    value={newPrice}
                                                    onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                                                    className="border rounded px-2 py-1 w-20"
                                                    min="0"
                                                    step="0.01"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setNewPrice(originalPrice)}
                                                    className="ml-2 text-sm text-gray-500 underline"
                                                >
                                                    Annuler
                                                </button>
                                            </>
                                        ) : (
                                            event?.price ? `${event.price.toFixed(2)} €` : "Gratuit"
                                        )}
                                    </span>
                                </span>
                            </label>
                        </div>
                    </form>

                    <div className="mb-[30px] px-[80px] xxs:px-[30px] border-[#d9d9d9] border-[0.5px] rounded-full">
                        <div className="flex justify-between items-center gap-[15px] py-[17px]">
                            <button type="button" onClick={handleDecrease} className="inline-flex justify-center items-center bg-[#C320C0]/10 hover:bg-[#C320C0] rounded-full w-[28px] aspect-square font-extralight text-[35px] hover:text-white">
                                <span className="h-[28px] leading-[22px]">&minus;</span>
                            </button>
                            <span className="font-light text-[16px]"><span>{ticketCount}</span> Ticket{ticketCount > 1 ? "s" : ""}</span>
                            <button type="button" onClick={handleIncrease} className="inline-flex justify-center items-center bg-[#C320C0]/10 hover:bg-[#C320C0] rounded-full w-[28px] aspect-square font-extralight text-[35px] hover:text-white">
                                <span className="h-[28px] leading-[22px]">+</span>
                            </button>
                        </div>
                    </div>
                    {errors && (
                        <p key={errorCount} className="text-red-500 text-[12px] text-center mt-2">
                            {errors}
                        </p>
                    )}

                    <button onClick={handleApplyToEvent} className="flex justify-center items-center gap-x-[10px] bg-[#C320C0] hover:bg-white px-[15px] border-[#C320C0] border-2 rounded-full w-full h-[50px] text-[15px] text-white hover:text-[#C320C0]">
                        <span>{`${event?.price > 0 ? "Candidater" : "Candidater"} (${formatEuro(event?.price)}) `}</span>
                    </button>
                </div>
            </div>

            <div className="border border-[#e5e5e5] rounded-[16px]">
                <div className="bg-[#C320C0] p-[16px] xxs:p-[12px] rounded-t-[16px]">
                    <h5 className="font-medium text-[17px] text-white text-center">
                        <i className="mr-2 fas fa-map-marker-alt"></i>
                        {editing ? (
                            <div className="space-y-1 text-black">
                                <input
                                    type="text"
                                    value={newStreetNumber}
                                    onChange={(e) => setNewStreetNumber(e.target.value)}
                                    placeholder="N°"
                                    className="w-full px-2 py-1 rounded text-sm"
                                />
                                <input
                                    type="text"
                                    value={newStreet}
                                    onChange={(e) => setNewStreet(e.target.value)}
                                    placeholder="Rue"
                                    className="w-full px-2 py-1 rounded text-sm"
                                />
                                <input
                                    type="text"
                                    value={newPostalCode}
                                    onChange={(e) => setNewPostalCode(e.target.value)}
                                    placeholder="Code postal"
                                    className="w-full px-2 py-1 rounded text-sm"
                                />
                                <input
                                    type="text"
                                    value={newCity}
                                    onChange={(e) => setNewCity(e.target.value)}
                                    placeholder="Ville"
                                    className="w-full px-2 py-1 rounded text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setNewStreetNumber(originalStreetNumber);
                                        setNewStreet(originalStreet);
                                        setNewPostalCode(originalPostalCode);
                                        setNewCity(originalCity);
                                    }}
                                    className="text-sm text-gray-200 underline"
                                >
                                    Annuler
                                </button>
                            </div>
                        ) : (
                            address
                        )}
                    </h5>
                </div>
                {address && (
                    <iframe
                        src={googleMapUrl}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-b-[16px] w-full h-[280px]"
                        title="Event Location"
                    />
                )}
            </div>
        </div>
    )
}
export default EventMainRightColumn;