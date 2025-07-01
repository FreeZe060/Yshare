import React from 'react';
import EventCard from './EventCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EventsSection = ({ title, linkText, events, emptyMessage, buttonLink, emptyButtonText }) => {
    const isEmpty = !events || events.length === 0;

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#580FCA] to-[#F929BB] bg-clip-text text-transparent">
                    {title}
                </h2>
                {!isEmpty && linkText && (
                    <Link
                        to={buttonLink}
                        className="text-[#580FCA] hover:text-[#F929BB] font-medium transition-colors"
                    >
                        {linkText}
                    </Link>
                )}
            </div>
            {
                events && events.length > 0 ? (
                    <div className="flex gap-6 scrollbar-hide pb-2">
                        {events.map(event => (
                            <motion.div key={event.id} whileHover={{ scale: 1.05 }} className="flex-shrink-0">
                                <EventCard event={event} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-[#BF1FC0] rounded-2xl bg-white bg-opacity-60 backdrop-blur-md shadow-inner px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                            <p className="text-gray-500 text-base">
                            {emptyMessage}
                        </p>
                        {buttonLink && (
                            <Link
                                to={buttonLink}
                                className="mt-4 inline-block px-6 py-2 rounded-lg bg-gradient-to-tr from-[#580FCA] to-[#F929BB] text-white font-semibold hover:opacity-90 transition"
                            >
                                {emptyButtonText || "Explorer"}
                            </Link>
                        )}
                    </motion.div>
                )
            }
        </>
    );
};

export default EventsSection;
